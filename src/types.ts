import type { GraphQLError } from 'graphql'
import type {
  DefaultBodyType,
  GraphQLRequest,
  GraphQLVariables,
  MockedRequest,
  Path,
  rest,
  RestRequest,
} from 'msw'

export type Body = DefaultBodyType
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GraphQLPayload = Record<string, any>
export type GraphQLResponse<T> = {
  data?: T
  errors?: GraphQLError[]
}
export type Method = keyof typeof rest
export type AnyInteraction<
  RequestBodyType extends Body = Body,
  ResponseBodyType extends Body = Body,
  Variables extends GraphQLVariables = GraphQLVariables,
  GraphQLDataType extends GraphQLPayload = GraphQLPayload
> =
  | GraphQLInteraction<Variables, GraphQLDataType>
  | RestInteraction<RequestBodyType, ResponseBodyType>

export type CommonRecordInteraction = {
  description: string
  providerState?: string
  responseStatus?: number
  once?: boolean
  matchingRules?: MatchingRules
}

export type InterceptRequest = (
  request: MockedRequest | GraphQLRequest<GraphQLVariables>,
  response: Body
) => Promise<void>

export type RestInteraction<
  RequestBodyType extends Body = Body,
  ResponseBodyType extends Body = Body
> = CommonRecordInteraction & {
  api: 'rest'
  path: Path
  method: Method
  matchRequest?: (req: RestRequest<RequestBodyType>) => boolean
  response: ResponseBodyType
}
export type GraphQLInteraction<
  RequestBodyType extends GraphQLVariables = GraphQLVariables,
  ResponseBodyType extends GraphQLPayload = GraphQLPayload
> = CommonRecordInteraction & {
  api: 'graphql'
  type: 'query' | 'mutation'
  name: string
  matchRequest?: (req: GraphQLRequest<RequestBodyType>) => boolean
  data?: ResponseBodyType
  errors?: GraphQLError[]
}
export type HeadersConfig = {
  includes?: string[]
  excludes?: string[]
}
export type Pact = {
  consumer: string
  provider: string
  folder?: string
  headersConfig?: HeadersConfig
  basePath?: string
  pactSpecificationVersion?: '2.0.0'
}

export type HeaderType = Record<string, string | string[]> | undefined

export type Rule =
  | {
      match: 'type'
    }
  | { match: 'regexp'; regex: RegExp }

export type MatchingRules = { [key: string]: Rule }
type BaseXHR = {
  headers?: HeaderType
  body?: Body
}
export type Interaction = {
  description: string
  providerState?: string
  request: {
    method: string
    path: string
    query?: string
  } & BaseXHR
  response: {
    status: string | number | undefined
    matchingRules?: MatchingRules
  } & BaseXHR
}
export type MetaData = {
  pactSpecification: {
    version: string
  }
  client: {
    name: 'pact-msw-handlers'
    version: string
  }
}
export type PactFile = {
  consumer: { name: string }
  provider: { name: string }
  interactions: Interaction[]
  metadata: MetaData
}
