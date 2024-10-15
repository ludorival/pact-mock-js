import {
  Pact as BasePact,
  Interaction,
  MinimalInteraction,
  PactFile,
  PactV2,
  PactV3,
  PactV4,
  ToRecordInteraction,
} from '@pact-mock-js/core'
import { omit } from 'lodash'
import {
  GraphQLContext,
  MockedRequest,
  ResponseTransformer,
  RestContext,
} from 'msw'
import {
  GraphQLPayload,
  GraphQLResponse,
  HeaderType,
  HeadersConfig,
} from 'types'
export { PactV2, PactV3, PactV4, MinimalInteraction }

type Options = {
  outputDir?: string
  headersConfig?: HeadersConfig
  basePath?: string
}

type Request = PactV2.Request | PactV3.Request | PactV4.Request
export class Pact<I extends Interaction = PactV2.Interaction> extends BasePact {
  private options: Options
  constructor(pact: Omit<PactFile<I>, 'interactions'>, options?: Options) {
    super(pact, options?.outputDir)
    this.options = { ...options, outputDir: 'pacts' }
  }

  async toTransformers(
    interaction: MinimalInteraction<I>,
    req: MockedRequest,
    context: GraphQLContext<GraphQLPayload> | RestContext
  ): Promise<ResponseTransformer[]> {
    await toRequest(req, this.options)
      .then((request) =>
        this.record({
          ...interaction,
          request,
        } as ToRecordInteraction<I>)
      )
      .then()
    const responseV4 = (interaction.response as any).body?.content
      ? (interaction.response as PactV4.ResponseClass)
      : null
    const response = responseV4
      ? null
      : (interaction.response as PactV2.Response | PactV3.Response)
    const content = responseV4?.body?.content || response?.body
    const graphQLResponse = content?.errors
      ? (content as GraphQLResponse)
      : content?.data
      ? (content as GraphQLResponse)
      : null
    const responseStatus = responseV4?.status || response?.status || 200
    if (graphQLResponse?.errors && 'errors' in context) {
      return [context.errors(graphQLResponse.errors)]
    } else if (graphQLResponse?.data && 'data' in context) {
      return [context.data(graphQLResponse.data)]
    } else if ('json' in context) {
      return [
        context.status(responseStatus),
        ...(content && (typeof content === 'object' || Array.isArray(content))
          ? [context.json(content)]
          : content
          ? [context.body(content.toString())]
          : []),
      ]
    } else {
      return [context.status(responseStatus)]
    }
  }
}

async function toRequest(
  req: MockedRequest,
  { headersConfig, basePath }: Options
): Promise<Request> {
  const path = req.url.pathname.replace(basePath || '', '')
  const query = req.url.searchParams.toString() || undefined
  const body: Body = await req
    .json()
    .catch(() => req.text())
    .catch(() => undefined)

  return {
    method: req.method,
    path,
    headers: omitHeaders(req.headers.all(), headersConfig),
    body,
    query,
  } as Request
}

const omitHeaders = (
  headers: HeaderType,
  headersConfig: HeadersConfig = {}
) => {
  const blocklist = headersConfig.excludes || []
  if (headersConfig.includes) {
    const remove = Object.keys(omit(headers, ...headersConfig.includes))
    blocklist.push(...remove)
  }
  return omit(headers, [...blocklist])
}
