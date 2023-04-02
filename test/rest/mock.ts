import { rest, RestInteraction } from 'pact-msw'

export const todosWillRaiseTechnicalFailure: RestInteraction = {
  api: 'rest',
  providerState: 'will return a 500 http error',
  description: 'graphql api returns a 500 http error',
  method: 'get',
  path: '*/todos',
  responseStatus: 500,
  response: undefined,
}
export const emptyTodos = rest({
  description: 'empty todo list',
  method: 'get',
  path: '*/todos',
  response: [],
})

export const multipleTodos = rest({
  description: 'multiple todo list',
  method: 'get',
  path: '*/todos',
  response: [
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
  ],
})

export const todoByIdFound = rest({
  description: 'should found a todo item by its id',
  providerState: 'there is an existing todo item with this id',
  method: 'get',
  path: '*/todos/*',
  response: {
    id: '1',
    title: 'Buy groceries',
    description: 'Milk, bread, eggs, cheese',
    completed: false,
  },
})

export const todoByIdNotFound = rest({
  description: 'should not found a todo item by its id',
  method: 'get',
  path: '*/todos/*',
  responseStatus: 404,
  response: { message: 'The todo item 1 is not found' },
})

export const createTodoWillSucceed = rest({
  description: 'should create a Todo with success',
  method: 'post',
  path: '*/todos',
  response: {
    id: '1',
    title: 'Buy groceries',
    description: 'Milk, bread, eggs, cheese',
    completed: false,
  },
})
