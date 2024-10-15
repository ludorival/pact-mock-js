/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { setupServer } from 'msw/node'
import { createTodo, fetchTodos, todoById } from './graphql.client'
import {
  createTodoWillSucceed,
  emptyTodos,
  multipleTodos,
  pact,
  todoByIdFound,
  todoByIdNotFound,
  todosWillRaiseTechnicalFailure,
} from './handlers'

const server = setupServer()

beforeAll(async () => {
  await pact.reset()
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(async () => {
  server.close()
  const pactFile = await pact.generatePactFile()
  expect(pactFile).toMatchSnapshot()
})

describe('To-Do list GraphQL API client', () => {
  describe('fetchTodos', () => {
    it('should fetch all To-Do items', async () => {
      // use multipleTodos handlers from contracts
      server.use(multipleTodos)

      // call the fetchTodos function and get the actual data
      const actualData = await fetchTodos()

      // expect the actual data to match the expected data
      expect(actualData).toMatchSnapshot()
    })

    it('should get a technical failure the first time and an empty todo list', async () => {
      // use todosWillRaiseTechnicalFailure and emptyTodos handlers from contracts
      server.use(todosWillRaiseTechnicalFailure, emptyTodos)

      // call first time fetchTodos should return an error
      expect.assertions(1)
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
  })

  describe('createTodo', () => {
    it('should create a new To-Do item', async () => {
      // use createTodoWillSucceed handlers from contracts
      server.use(createTodoWillSucceed)

      // call the createTodo function and get the actual data
      const actualData = await createTodo('Buy groceries')

      // expect the actual data to match the expected data
      expect(actualData).toMatchSnapshot()
    })
  })

  describe('todoById', () => {
    it('should get a todo by its id', async () => {
      // use todoByIdFound handlers from contracts
      server.use(todoByIdFound)

      // call the todoById function and get the actual data
      const actualData = await todoById('1')

      // expect the actual data to match the expected data
      expect(actualData).toMatchSnapshot()
    })

    it('should get an error when getting a todo does not found it', async () => {
      // use todoByIdFound handlers from contracts
      server.use(todoByIdNotFound)

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
