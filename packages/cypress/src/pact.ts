import type {
  CyHttpMessages,
  RouteHandlerController,
  StaticResponse,
} from 'cypress/types/net-stubbing'
import { omit } from 'lodash'
import {
  Pact as BasePact,
  InputPact,
  InteractionFor,
  MinimalInteraction,
  PactFile,
  PactV2,
  PactV3,
  PactV4,
  Version,
} from 'pact-mock-js.core'
import { HeaderType, HeadersConfig } from './types'

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
  constructor(pact: InputPact<P>, options?: Options) {
    super(pact as any)
    this.options = { ...options }
  }

  toHandler<T extends object>(
    input: MinimalInteraction<InteractionFor<P, T>> | T
  ): RouteHandlerController {
    const version = this.version
    return (req) => {
      req.reply()
      const interaction =
        'response' in input ? input : buildResponse(input, version)
      return req.reply(
        this.recordResponse(
          interaction as MinimalInteraction<InteractionFor<P, T>>,
          req
        )
      )
    }
  }
  recordResponse(
    interaction: MinimalInteraction<InteractionFor<P>>,
    req: CyHttpMessages.IncomingHttpRequest
  ): StaticResponse {
    const request = toRequest(req, this.options)
    this.record({ ...interaction, request } as any)
    const responseV4 = (interaction.response as { body?: { content: unknown } })
      .body?.content
      ? (interaction.response as PactV4.ResponseClass)
      : null
    const response = responseV4
      ? null
      : (interaction.response as PactV2.Response | PactV3.Response)

    return {
      statusCode: responseV4?.status || response?.status,
      body: responseV4?.body || response?.body,
      headers: responseV4?.headers || response?.headers,
    }
  }
}

function toRequest(
  req: CyHttpMessages.IncomingHttpRequest,
  { headersConfig, basePath }: Options
): Request {
  const parts = req.url.split('?')
  const path = parts[0].replace(basePath || '', '')
  const query = parts.slice(1).join('?')
  const body: Body = req.body

  return {
    method: req.method,
    path,
    headers: omitHeaders(req.headers, headersConfig),
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
