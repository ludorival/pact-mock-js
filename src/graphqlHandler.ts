import { graphql, GraphQLHandler, GraphQLRequest, GraphQLVariables } from 'msw'
import { GraphQLInteraction, GraphQLPayload, InterceptRequest } from './types'

export function toGraphQLHandler<
  RequestBodyType extends GraphQLVariables = GraphQLVariables,
  ResponseBodyType extends GraphQLPayload = GraphQLPayload
>({
  interaction,
  onInterceptRequest,
}: {
  interaction: GraphQLInteraction<RequestBodyType, ResponseBodyType>
  onInterceptRequest: InterceptRequest
}): GraphQLHandler<GraphQLRequest<RequestBodyType>> {
  return graphql[interaction.type](interaction.name, async (req, _res, ctx) => {
    const res = interaction.once ? _res.once : _res
    if (interaction.errors) {
      await onInterceptRequest(req, { errors: interaction.errors })
      return res(ctx.errors(interaction.errors))
    } else if (interaction.data) {
      await onInterceptRequest(req, { data: interaction.data })
      return res(ctx.data(interaction.data))
    } else if (interaction.responseStatus) {
      await onInterceptRequest(req, undefined)
      return res(ctx.status(interaction.responseStatus))
    } else {
      throw new Error('Neither data or errors are defined')
    }
  })
}
