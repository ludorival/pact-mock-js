/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { setupServer } from 'msw/node'
import { pactProvider, rest } from 'pact-msw'
import { deleteMovie } from './movieApi'

const server = setupServer()

const provider = pactProvider({
  consumer: 'test-consumer',
  provider: 'test-relax-provider',
  basePath: '/base',
  strict: false,
  headersConfig: {
    includes: ['content-type'],
  },
})

beforeAll(() => {
  server.listen()
  provider.removePact()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
  provider.writePact()
  expect(provider.pactFile).toMatchSnapshot()
})

const mockedDeleted = rest({
  description: 'should delete a movie',
  method: 'delete',
  path: '*/movie/*',
  response: `deleted`,
})

describe('Non strict use case', () => {
  it('should accept to record interaction with same description in non strict mode', async () => {
    server.use(...provider.toHandlers(mockedDeleted))

    let message = await deleteMovie('1')
    message = await deleteMovie('2')

    expect(message).toEqual(mockedDeleted.response)
    expect(provider.pactFile.interactions).toHaveLength(2)
  })

  it('should fail if the interaction override the strict mode', async () => {
    server.use(
      ...provider.toHandlers({
        ...mockedDeleted,
        description: `${mockedDeleted.description} - strict`,
        strict: true,
      })
    )

    expect.assertions(1)
    let message = await deleteMovie('1')
    try {
      message = await deleteMovie('2')
      expect(message).toBeUndefined()
    } catch (e) {
      expect((e as Error).message).toContain(
        'The pact pacts/test-consumer-test-relax-provider.json contains an interaction with same description should delete a movie'
      )
    }
  })
})
