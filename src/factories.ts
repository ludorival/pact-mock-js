import type { GraphQLError } from 'graphql'
import type { GraphQLVariables } from 'msw'
import type {
  Body,
  GraphQLPayload,
  GraphQLInteraction,
  AnyInteraction,
  RestInteraction,
} from './types'

export function graphQLQuery<
  ResponseBodyType extends GraphQLPayload = GraphQLPayload,
  RequestBodyType extends GraphQLVariables = GraphQLVariables
>(
  options: Pick<
    GraphQLInteraction<RequestBodyType, ResponseBodyType>,
    'description' | 'providerState' | 'name' | 'matchingRules' | 'matchRequest'
  > & { data: ResponseBodyType }
): GraphQLInteraction<RequestBodyType, ResponseBodyType> {
  return {
    api: 'graphql',
    type: 'query',
    ...options,
  }
}

export function graphQLMutation<
  ResponseBodyType extends GraphQLPayload = GraphQLPayload,
  RequestBodyType extends GraphQLVariables = GraphQLVariables
>(
  options: Pick<
    GraphQLInteraction<RequestBodyType, ResponseBodyType>,
    'description' | 'providerState' | 'name' | 'matchingRules' | 'matchRequest'
  > & { data: ResponseBodyType }
): GraphQLInteraction<RequestBodyType, ResponseBodyType> {
  return {
    api: 'graphql',
    type: 'mutation',
    ...options,
  }
}

export function graphQLErrors<
  RequestBodyType extends GraphQLVariables = GraphQLVariables
>(
  options: Pick<
    GraphQLInteraction<RequestBodyType, GraphQLPayload>,
    | 'description'
    | 'providerState'
    | 'name'
    | 'matchingRules'
    | 'type'
    | 'matchRequest'
  > & { errors: GraphQLError[] }
): GraphQLInteraction<RequestBodyType, GraphQLPayload> {
  return {
    api: 'graphql',
    ...options,
  }
}

export function rest<
  RequestBodyType extends Body = Body,
  ResponseBodyType extends Body = Body
>(
  options: Omit<RestInteraction<RequestBodyType, ResponseBodyType>, 'api'>
): RestInteraction<RequestBodyType, ResponseBodyType> {
  return {
    api: 'rest',
    ...options,
  }
}

export const once = (interaction: AnyInteraction) => ({
  ...interaction,
  once: true,
})
