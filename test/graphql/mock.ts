import {
  graphQLErrors,
  graphQLMutation,
  graphQLQuery,
  GraphQLInteraction,
} from 'pact-msw'
import { GraphQLError } from 'graphql'
import { Todo } from '../Todo'

export const todosWillRaiseTechnicalFailure: GraphQLInteraction = {
  api: 'graphql',
  type: 'query',
  providerState: 'will return a 500 http error',
  description: 'graphql api returns a 500 http error',
  name: 'todos',
  responseStatus: 500,
}
export const emptyTodos = graphQLQuery({
  description: 'empty todo list',
  name: 'todos',
  data: {
    todos: [],
  },
})

export const multipleTodos = graphQLQuery<{ todos: Todo[] }>({
  description: 'multiple todo list',
  name: 'todos',
  data: {
    todos: [
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
  },
})

export const todoByIdFound = graphQLQuery({
  description: 'should found a todo item by its id',
  providerState: 'there is an existing todo item with this id',
  name: 'todoById',
  data: {
    todoById: {
      id: '1',
      title: 'Buy groceries',
      description: 'Milk, bread, eggs, cheese',
      completed: false,
    },
  },
})

export const todoByIdNotFound = graphQLErrors({
  type: 'query',
  description: 'should not found a todo item by its id',
  name: 'todoById',
  errors: [{ message: 'The todo item 1 is not found' } as GraphQLError],
})

export const createTodoWillSucceed = graphQLMutation({
  description: 'should create a Todo with success',
  name: 'createTodo',
  data: {
    createTodo: {
      id: '1',
      title: 'Buy groceries',
      description: 'Milk, bread, eggs, cheese',
      completed: false,
    },
  },
})
