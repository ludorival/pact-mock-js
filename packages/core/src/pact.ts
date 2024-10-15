import { mkdir, readFile, readdir, writeFile, rm } from 'fs/promises'
import { existsSync } from 'fs'
import { join, resolve } from 'path'
export * from './types'
import { PactV2, PactV3, PactV4 } from 'types'

export type PactFile<I> = I extends PactV2.Interaction
  ? PactV2.PactFile
  : I extends PactV3.Interaction
  ? PactV3.PactFile
  : PactV4.PactFile

export type Interaction<TResponse = any> =
  | PactV2.Interaction<TResponse>
  | PactV3.Interaction<TResponse>
  | PactV4.Interaction<TResponse>

export type MinimalInteraction<I extends Interaction = PactV2.Interaction> =
  Partial<Omit<I, 'response'>> & Pick<I, 'response'>

export type ToRecordInteraction<I extends Interaction> = Partial<
  Omit<I, 'response' | 'request'>
> &
  Pick<I, 'response' | 'request'>
function sanitizeFileName(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '')
}

function pactName<I>(pact: Omit<PactFile<I>, 'interactions'>) {
  return `${pact.consumer.name}-${pact.provider.name}`
}
export class Pact<I extends Interaction = PactV2.Interaction> {
  private outputDir: string
  constructor(
    private pact: Omit<PactFile<I>, 'interactions'>,
    outputDir = 'pacts'
  ) {
    this.outputDir = resolve(join(outputDir, pactName<I>(pact)))
    mkdir(this.outputDir, { recursive: true }).catch((e) =>
      console.error(
        `There is an error when trying to create the pact output directory: ${e}`
      )
    )
  }

  public get name(): string {
    return pactName(this.pact)
  }
  public get version(): string {
    return this.pact.metaData.pactSpecification?.version || '2.0.0'
  }

  async record<T = any>(interaction: ToRecordInteraction<I>): Promise<T> {
    const response = interaction.response as { status?: number }
    const description =
      interaction.description ||
      `${interaction.request?.method} ${
        interaction.request?.path
      } returns status ${response.status || 200}`

    const fileName = join(
      this.outputDir,
      `${sanitizeFileName(description)}.interaction.json`
    )
    if (existsSync(fileName)) {
      console.warn(
        `The file ${resolve(fileName)} already exists and will be overriden`
      )
    }
    await mkdir(this.outputDir, { recursive: true })
    await writeFile(fileName, JSON.stringify({ description, ...interaction }))
    if (
      typeof interaction.response === 'object' &&
      interaction.response &&
      'status' in interaction.response
    ) {
      return interaction.response.body
    }
    if (Array.isArray(interaction.response)) {
      return interaction.response[0]?.contents
    }
    return interaction.response as T
  }

  async generatePactFile(): Promise<PactFile<I>> {
    const interactionFiles = (await readdir(this.outputDir)).filter((f) =>
      f.endsWith('interaction.json')
    )
    const interactions: Interaction[] = await Promise.all(
      interactionFiles.map((f) =>
        readFile(join(this.outputDir, f)).then(
          (buffer) => JSON.parse(buffer.toString()) as Interaction
        )
      )
    )
    const pactFile = { ...this.pact, interactions } as PactFile<I>
    await writeFile(
      join(this.outputDir, '..', `${this.name}.json`),
      JSON.stringify(pactFile, null, 2)
    )
    Promise.all(interactionFiles.map((f) => rm(join(this.outputDir, f))))
      .catch((e) =>
        console.warn(
          `Got an error when deleting an interaction file in '${this.outputDir}' : ${e}`
        )
      )
      .then()
    return pactFile
  }

  public get fileName(): string {
    return join(this.outputDir, '..', `${this.name}.json`)
  }

  async reset() {
    await rm(this.outputDir, { recursive: true }).catch((e) =>
      console.warn(
        `Cannot remove the pact directory output '${this.outputDir}' : ${e}`
      )
    )
  }
}
