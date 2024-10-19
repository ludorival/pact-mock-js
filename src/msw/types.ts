/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GraphQLError } from 'graphql'

export type GraphQLPayload = Record<string, any>
export type GraphQLResponse<T = any> = {
  data?: T
  errors?: GraphQLError[]
}
