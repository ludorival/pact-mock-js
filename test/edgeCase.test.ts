/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { setupServer } from 'msw/node'
import { pactProvider, rest } from 'pact-msw'
import { deleteMovie, fetchMovies } from './movieApi'

const server = setupServer()

const provider = pactProvider({
  consumer: 'movie-consumer',
  provider: 'movie-provider',
  folder: 'test/pacts',
  headersConfig: {
    includes: ['content-type'],
  },
})

beforeAll(() => {
  server.listen()
  provider.loadPact()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
  provider.writePact()
  expect(provider.pactFile).toMatchSnapshot()
})

describe('Edge case', () => {
  it('should record interaction returning a non object', async () => {
    const mockedDeleted = rest({
      description: 'should delete a movie',
      method: 'delete',
      path: '*/movie/*',
      response: `deleted`,
    })
    server.use(...provider.toHandlers(mockedDeleted))

    const message = await deleteMovie('1')

    expect(message).toEqual(mockedDeleted.response)
  })

  it('should not fail if there is already a recorded same interaction', async () => {
    const mockMovies = rest({
      description: 'a request to list all movies',
      method: 'get',
      path: '*/movies',
      response: [
        {
          id: 1,
          name: 'Movie 1',
          year: 2008,
        },
        {
          id: 2,
          name: 'Movie 2',
          year: 2008,
        },
      ],
    })
    server.use(...provider.toHandlers(mockMovies))

    const movies = await fetchMovies()

    expect(movies).toEqual(mockMovies.response)
  })

  it('should fail if there is already a recorded interaction with a different content', async () => {
    const mockMovies = rest({
      description: 'a request to list all movies',
      method: 'get',
      path: '*/movies',
      response: [],
    })
    server.use(...provider.toHandlers(mockMovies))

    expect.assertions(1)
    try {
      const movies = await fetchMovies()
      expect(movies).toBe([])
    } catch (e) {
      expect((e as Error).message).toContain(
        'The pact test/pacts/movie-consumer-movie-provider.json contains an interaction with same description a request to list all movies'
      )
    }
  })
})
