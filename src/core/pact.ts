import {
  InputPact,
  InteractionFor,
  PactFile,
  PactV2,
  ToRecordInteraction,
  Version,
} from '../types'

function pactName<P extends PactFile>(pact: InputPact<P>) {
  return `${pact.consumer.name}-${pact.provider.name}`
}
export class Pact<T extends PactFile = PactV2.PactFile> {
  private interactions: Record<string, InteractionFor<T>> = {}
  constructor(private pact: InputPact<T>) {
    if (!pact.metadata?.pactSpecification?.version)
      throw new Error(`The version is missing in the Pact. Please provide the right version like
    { consumer: { name : 'my-consumer'}, provider : { name: 'my-provider'},
    metadata : {pactSpecification: { version : '2.0.0'}}}`)
  }

  public get name(): string {
    return pactName(this.pact)
  }
  public get version(): Version {
    return this.pact.metadata?.pactSpecification?.version || '2.0.0'
  }

  record<TResponse = unknown, TRequest = unknown>(
    input: ToRecordInteraction<InteractionFor<T, TResponse, TRequest>>
  ) {
    const response = input.response as { status?: number }
    const description =
      input.description ||
      `${input.request?.method} ${input.request?.path} returns status ${
        response.status || 200
      }`

    const interaction = { description, ...input } as InteractionFor<
      T,
      TResponse,
      TRequest
    >
    const existingInteraction = this.interactions[description]
    if (
      existingInteraction &&
      JSON.stringify(existingInteraction) !== JSON.stringify(interaction)
    ) {
      console.warn(
        `The interaction ${description} already exists but with different content. It is recommended that the interaction stays deterministic.`
      )
    }
    this.interactions[description] = interaction
  }

  generatePactFile(): T {
    const interactions = Object.keys(this.interactions)
      .map((d) => this.interactions[d])
      .sort((a, b) => a.description.localeCompare(b.description))
    const pactFile = { ...(this.pact as T), interactions }
    return pactFile
  }

  async reset() {
    this.interactions = {}
  }
}
