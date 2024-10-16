import {
  Pact as BasePact,
  InteractionFor,
  MinimalInteraction,
  PactFile,
  PactV2,
  PactV3,
  PactV4,
  Version,
} from '@pact-mock-js/core'
import { omit } from 'lodash'
import {
  GraphQLContext,
  MockedRequest,
  ResponseResolver,
  ResponseTransformer,
  RestContext,
} from 'msw'
import {
  GraphQLPayload,
  GraphQLResponse,
  HeaderType,
  HeadersConfig,
} from 'types'
export { MinimalInteraction, PactV2, PactV3, PactV4 }

type Options = {
  headersConfig?: HeadersConfig
  basePath?: string
}

function buildResponse<T>(content: T, version: Version) {
  switch (version) {
    case '2.0.0':
      return {
        response: { status: 200, body: content },
      } as MinimalInteraction<PactV2.Interaction>
    case '3.0.0':
      return {
        response: { status: 200, body: content },
      } as MinimalInteraction<PactV3.Interaction>

    case '4.0.0':
      return {
        response: {
          status: 200,
          body: { content, contentType: 'application/json' },
        },
      } as MinimalInteraction<PactV4.Interaction>
  }
}

type Request = PactV2.Request | PactV3.Request | PactV4.Request
export class Pact<P extends PactFile> extends BasePact {
  private options: Options
  constructor(pact: Omit<P, 'interactions'>, options?: Options) {
    super(pact)
    this.options = { ...options }
  }

  toResolver<T extends object>(
    input: MinimalInteraction<InteractionFor<P, T>> | T,
    once?: boolean
  ): ResponseResolver<
    MockedRequest,
    GraphQLContext<GraphQLPayload> | RestContext
  > {
    const version = this.version
    return async (req, res, ctx) => {
      const interaction =
        'response' in input ? input : buildResponse(input, version)
      const transformers = await this.toTransformers(
        interaction as MinimalInteraction<InteractionFor<P, T>>,
        req,
        ctx
      )
      if (once) return res.once(...transformers)
      else return res(...transformers)
    }
  }
  async toTransformers(
    interaction: MinimalInteraction<InteractionFor<P>>,
    req: MockedRequest,
    context: GraphQLContext<GraphQLPayload> | RestContext
  ): Promise<ResponseTransformer[]> {
    await toRequest(req, this.options)
      .then((request) =>
        this.record({
          ...interaction,
          request,
        })
      )
      .then()
    const responseV4 = (interaction.response as { body?: { content: unknown } })
      .body?.content
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
