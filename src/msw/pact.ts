import {
  GraphQLContext,
  MockedRequest,
  ResponseResolver,
  ResponseTransformer,
  RestContext,
} from 'msw'
import { Pact as BasePact, buildResponse } from '../core'
import {
  InputPact,
  InteractionFor,
  MinimalInteraction,
  Options,
  PactFile,
  PactV2,
  PactV3,
  PactV4,
  Request,
  ToRecordInteraction,
} from '../types'
import { GraphQLPayload, GraphQLResponse } from './types'

export class Pact<P extends PactFile> extends BasePact<P> {
  constructor(pact: InputPact<P>, options?: Options) {
    super(pact, options)
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
    const toRecord = {
      ...interaction,
      request: await toRequest(req),
    } as ToRecordInteraction<InteractionFor<P>>
    this.record(toRecord)

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

async function toRequest(req: MockedRequest): Promise<Request> {
  const path = req.url.pathname
  const query = req.url.searchParams.toString() || undefined
  const body: Body = await req
    .json()
    .catch(() => req.text())
    .catch(() => undefined)

  return {
    method: req.method,
    path,
    headers: req.headers.all(),
    body,
    query,
  } as Request
}
