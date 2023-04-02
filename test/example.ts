/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { setupServer } from 'msw/node'
import { pactProvider, rest } from 'pact-msw'

const server = setupServer()

const provider = pactProvider({
  consumer: 'test-consumer',
  provider: 'test-provider',
})
provider.removePact()

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

it('get all movies', async () => {
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
