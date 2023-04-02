/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { setupServer } from 'msw/node'
import { once, pactProvider } from 'pact-msw'
import { createTodo, fetchTodos, todoById } from './graphql.client'
import {
  createTodoWillSucceed,
  emptyTodos,
  multipleTodos,
  todoByIdFound,
  todoByIdNotFound,
  todosWillRaiseTechnicalFailure,
} from './mock'

const server = setupServer()

const provider = pactProvider({
  consumer: 'test-consumer',
  provider: 'graphql-provider',
  headersConfig: {
    includes: ['content-type'],
  },
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

describe('To-Do list GraphQL API client', () => {
  describe('fetchTodos', () => {
    it('should fetch all To-Do items', async () => {
      // use multipleTodos handlers from contracts
      server.use(...provider.toHandlers(multipleTodos))

      // call the fetchTodos function and get the actual data
      const actualData = await fetchTodos()

      // expect the actual data to match the expected data
      expect(actualData).toEqual(multipleTodos.data?.todos)
    })

    it('should get a technical failure the first time and an empty todo list', async () => {
      // use todosWillRaiseTechnicalFailure and emptyTodos handlers from contracts
      server.use(
        ...provider.toHandlers(once(todosWillRaiseTechnicalFailure), emptyTodos)
      )

      // call first time fetchTodos should return an error
      expect.assertions(2)
      fetchTodos().catch((e) =>
        expect(e).toMatchObject({
          message: 'Request failed with status code 500',
        })
      )
      // call the fetchTodos function and get the actual data
      const actualData = await fetchTodos()

      // expect the actual data to match the expected data
      expect(actualData).toEqual([])
    })

    it('should return an error if the graphql interaction is wrong', async () => {
      // use wrongInteraction handlers from contracts
      server.use(
        ...provider.toHandlers({
          api: 'graphql',
          type: 'query',
          description: 'should never been recorded',
          name: 'todos',
        })
      )

      // call first time fetchTodos should return an error
      expect.assertions(1)
      fetchTodos().catch((e) =>
        expect(e).toMatchObject({
          message: 'Neither data or errors are defined',
        })
      )
    })
  })

  describe('createTodo', () => {
    it('should create a new To-Do item', async () => {
      // use createTodoWillSucceed handlers from contracts
      server.use(...provider.toHandlers(createTodoWillSucceed))

      // call the createTodo function and get the actual data
      const actualData = await createTodo(
        createTodoWillSucceed.data!.createTodo.title
      )

      // expect the actual data to match the expected data
      expect(actualData).toEqual(createTodoWillSucceed.data?.createTodo)
    })
  })

  describe('todoById', () => {
    it('should get a todo by its id', async () => {
      // use todoByIdFound handlers from contracts
      server.use(...provider.toHandlers(todoByIdFound))

      // call the todoById function and get the actual data
      const actualData = await todoById(todoByIdFound.data!.todoById.id)

      // expect the actual data to match the expected data
      expect(actualData).toEqual(todoByIdFound.data?.todoById)
    })

    it('should get an error when getting a todo does not found it', async () => {
      // use todoByIdFound handlers from contracts
      server.use(...provider.toHandlers(todoByIdNotFound))

      // call the todoById function and get the actual data
      try {
        await todoById('1')
        fail('Should never reach')
      } catch (e: unknown) {
        expect(e).toMatchObject({ message: 'The todo item 1 is not found' })
      }
    })
  })
})
