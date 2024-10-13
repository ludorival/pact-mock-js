import { MockedInteractionV3 } from "../src/index"
import { Todo } from "./rest.client"


export const todosWillRaiseTechnicalFailure: MockedInteractionV3 = {
  providerStates: 'will return a 500 http error',
  description: 'graphql api returns a 500 http error',
  response: {
    status: 500
  }
}
export const emptyTodos: MockedInteractionV3<Todo[]> = {
  description: 'empty todo list',
  response: { body: [], status: 200 },
}

export const multipleTodos: MockedInteractionV3<Todo[]> = ({
  description: 'multiple todo list',
  response: {
    body: [
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
    matchingRules: {
      '$.body.data[*].id': {
        match: 'type',
      },
    },
  },

})


export const todoByIdFound: MockedInteractionV3<Todo> = ({
  description: 'should found a todo item by its id',
  providerStates: 'there is an existing todo item with this id',
  response: {
    body: {
      id: '1',
      title: 'Buy groceries',
      description: 'Milk, bread, eggs, cheese',
      completed: false,
    }
    
  },
})

export const todoByIdNotFound: MockedInteractionV3 = ({
  description: 'should not found a todo item by its id',
  response: { message: 'The todo item 1 is not found', status: 404 },
})

export const createTodoWillSucceed: MockedInteractionV3 = ({
  description: 'should create a Todo with success',
  response: {
    body: {
      id: '1',
      title: 'Buy groceries',
      description: 'Milk, bread, eggs, cheese',
      completed: false,
    }
  },
})
