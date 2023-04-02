import { MockedRequest, rest, RestHandler } from 'msw'
import { Body, InterceptRequest, RestInteraction } from './types'

export function toRestHandler<
  RequestBodyType extends Body = Body,
  ResponseBodyType extends Body = Body
>({
  interaction,
  onInterceptRequest,
}: {
  interaction: RestInteraction<RequestBodyType, ResponseBodyType>
  onInterceptRequest: InterceptRequest
}): RestHandler<MockedRequest<RequestBodyType>> {
  return rest[interaction.method](interaction.path, async (req, _res, ctx) => {
    const response = interaction.response
    await onInterceptRequest(req, interaction.response)
    const res = interaction.once ? _res.once : _res
    const transformers = [
      ctx.status(interaction.responseStatus || 200),
      ...(typeof response === 'object'
        ? [ctx.json(response)]
        : response
        ? [ctx.body(response.toString())]
        : []),
    ]
    return res(...transformers)
  })
}
