import type { RouteHandlerController } from 'cypress/types/net-stubbing'
import { Pact } from '../..'

export const pact = new Pact(
  {
    consumer: { name: 'test-consumer' },
    provider: { name: 'rest-provider' },
    metadata: { pactSpecification: { version: '2.0.0' } },
  },
  {
    basePath: '/base',
    headersConfig: {
      includes: ['content-type'],
    },
  }
)
export const todosWillRaiseTechnicalFailure = pact.toHandler({
  providerState: 'will return a 500 http error',
  description: 'rest api returns a 500 http error',
  response: {
    status: 500,
  },
})

export const emptyTodos = pact.toHandler({
  description: 'empty todo list',
  response: {
    status: 200,
    body: [],
  },
})
// I can pass directly the body here, the status and description will be resolved automatically
export const multipleTodos = pact.toHandler([
  {
    id: '1',
    title: 'Buy groceries',
    description: 'Milk, bread, eggs, cheese',
    completed: false,
  },
  {
    id: '2',
    title: 'Do laundry',
    description: '',
    completed: true,
  },
  {
    id: '3',
    title: 'Call plumber',
    description: 'Fix leaky faucet in the bathroom',
    completed: false,
  },
])

export const todoByIdFound = pact.toHandler({
  description: 'should found a todo item by its id',
  providerState: 'there is an existing todo item with this id',
  response: {
    status: 200,
    body: {
      id: '1',
      title: 'Buy groceries',
      description: 'Milk, bread, eggs, cheese',
      completed: false,
    },
  },
})

export const todoByIdNotFound = pact.toHandler({
  description: 'should not found a todo item by its id',
  response: {
    status: 404,
    body: { message: 'The todo item 1 is not found' },
  },
})

// I can use the recordResponse, if I want to customize the response before
export const createTodoWillSucceed: RouteHandlerController = (req) =>
  req.reply(
    pact.recordResponse(
      {
        description: 'should create a Todo with success',
        response: {
          status: 201,
          body: {
            id: '1',
            title: 'Buy groceries',
            description: 'Milk, bread, eggs, cheese',
            completed: false,
          },
        },
      },
      req
    )
  )
