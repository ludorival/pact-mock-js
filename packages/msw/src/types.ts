/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GraphQLError } from 'graphql'

export type GraphQLPayload = Record<string, any>
export type GraphQLResponse<T = any> = {
  data?: T
  errors?: GraphQLError[]
}

export type HeadersConfig = {
  includes?: string[]
  excludes?: string[]
}
export type HeaderType = Record<string, string | string[]> | undefined
