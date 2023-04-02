import { omit } from 'lodash'
import { MockedRequest } from 'msw'
import path from 'path'
import {
  Body,
  HeadersConfig,
  HeaderType,
  Interaction,
  Pact,
  PactFile,
} from './types'
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

export const toRequest = async (
  req: MockedRequest,
  headersConfig?: HeadersConfig
) => {
  const path = req.url.pathname
  const query = req.url.searchParams.toString() || undefined
  const body: Body = await req
    .json()
    .catch(() => req.text())
    .catch(() => undefined)

  return {
    method: req.method,
    path,
    headers: omitHeaders(req.headers.all(), headersConfig),
    body,
    query,
  } as Interaction['request']
}
type FileSystem = {
  existsSync: (filename: string) => boolean
  mkdirSync: (dirname: string) => void
  writeFileSync: (filename: string, data: string) => void
  readFileSync: (filename: string) => Buffer
  rmSync: (filename: string, options: { recursive: boolean }) => void
}
let fs: FileSystem
const checkIfNodeEnv = (): FileSystem | undefined => {
  if (!fs) {
    try {
      fs = require('fs')
    } catch (e) {}
  }
  if (!fs?.existsSync) {
    console.warn('You need a node environment to save files.', {
      mode: 'warning',
      group: true,
    })
    return undefined
  } else {
    return fs
  }
}
const ensureDirExists = (filePath: string) => {
  const dirname = path.dirname(filePath)
  if (fs.existsSync?.(dirname)) {
    return true
  }
  fs.mkdirSync?.(dirname)
}

export const deleteFile = (filePath: string) => {
  const fs = checkIfNodeEnv()
  if (fs?.existsSync?.(filePath)) {
    fs.rmSync(filePath, { recursive: true })
  }
}
export const readPact = (filePath: string): PactFile | undefined => {
  const fs = checkIfNodeEnv()
  if (fs) {
    if (!fs.existsSync(filePath)) return undefined
    try {
      return JSON.parse(fs.readFileSync(filePath).toString())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.warn(`The pactFile ${filePath} might not exist: ${e.message}`)
      return undefined
    }
  }
}

export const writePact = (filePath: string, data: PactFile) => {
  const fs = checkIfNodeEnv()
  if (fs) {
    ensureDirExists(filePath)
    fs.writeFileSync?.(filePath, JSON.stringify(data, null, 2))
  }
}

export const ensureSamePact = (pact: Pact, pactFile?: PactFile) => {
  if (!pactFile) return
  if (
    pactFile?.consumer.name !== pact.consumer ||
    pactFile?.provider.name !== pact.provider
  )
    throw new Error(
      `The pactFile to load does not match with the expected couple (${pact.consumer}-${pact.provider} )`
    )
}

export const isNotTheSame = ({
  fileName,
  existingInteraction,
  interaction,
}: {
  fileName: string
  existingInteraction?: Interaction
  interaction: Interaction
}): boolean => {
  if (!existingInteraction) return true
  const isSame = existingInteraction
    ? JSON.stringify(existingInteraction) === JSON.stringify(interaction)
    : true

  if (!isSame) {
    throw new Error(
      `The pact ${fileName} contains an interaction with same description ${
        interaction.description
      }.
Previous interaction was 
${JSON.stringify(existingInteraction, null, 2)}
Current interaction is
${JSON.stringify(interaction, null, 2)}
----------------------------------
Make sure your mocks are deterministic. 
You can use headersConfig options from your provider
to exclude or include headers`
    )
  }
  return !isSame
}
