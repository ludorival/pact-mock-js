import { MockedRequest, RequestHandler } from 'msw'
import { AnyInteraction, Body, Interaction, Pact, PactFile } from './types'

import { isUndefined, omitBy, uniqBy } from 'lodash'
import pjson from '../package.json'
import { toGraphQLHandler } from './graphqlHandler'
import { toRestHandler } from './restHandler'
import {
  deleteFile,
  ensureSamePact,
  isNotTheSame,
  readPact,
  toRequest,
  writePact,
} from './utils'

class PactProvider {
  interactions: Interaction[]
  readonly fileName: string
  private constructor(public readonly pact: Pact) {
    this.interactions = []
    this.fileName = `${pact.folder || 'pacts'}/${pact.consumer}-${
      pact.provider
    }.json`
    this.pact.strict = this.pact.strict ?? true
  }

  removePact() {
    deleteFile(this.fileName)
  }

  loadPact(pactFile: PactFile | undefined = readPact(this.fileName)) {
    ensureSamePact(this.pact, pactFile)
    this.interactions = pactFile?.interactions || []
  }

  toHandlers(...interactions: AnyInteraction[]): Array<RequestHandler> {
    const pact = this.pact
    return interactions.map((interaction) => {
      const onInterceptRequest = async (req: MockedRequest, response: Body) => {
        const strict =
          interaction.strict !== undefined
            ? interaction.strict
            : this.pact.strict
        this.addInteraction(
          {
            description: interaction.description,
            providerState: interaction.providerState,
            request: await toRequest(req, pact),
            response: {
              status: interaction.responseStatus || 200,
              body: response,
              matchingRules: interaction.matchingRules,
            },
          },
          strict
        )
      }
      if (interaction.api == 'graphql') {
        return toGraphQLHandler({
          interaction,
          onInterceptRequest,
        })
      }
      return toRestHandler({
        interaction,
        onInterceptRequest,
      })
    })
  }

  private addInteraction(interaction: Interaction, strict?: boolean) {
    interaction = omitBy(interaction, isUndefined) as Interaction
    const existingInteraction = this.interactions.find(
      (i) => i.description === interaction.description
    )

    const canAdd = strict
      ? isNotTheSame({
          fileName: this.fileName,
          existingInteraction,
          interaction,
        })
      : true
    if (canAdd) this.interactions.push(interaction)
  }

  public get pactFile(): PactFile {
    return {
      consumer: { name: this.pact.consumer },
      provider: { name: this.pact.provider },
      interactions: this.interactions,
      metadata: {
        pactSpecification: {
          version: this.pact.pactSpecificationVersion || '2.0.0',
        },
        client: {
          name: 'pact-msw',
          version: pjson.version,
        },
      },
    }
  }

  writePact(
    writer: (filename: string, pactFile: PactFile) => void = writePact
  ) {
    writer(this.fileName, this.pactFile)
  }
  static provider(pact: Pact) {
    return new PactProvider(pact)
  }
}
/**
 * Create a new pact provider
 * @param pact the configuration option to generate a Pact file
 * @returns the pact for a given provider
 */
export function pactProvider(pact: Pact): PactProvider {
  return PactProvider.provider(pact)
}
