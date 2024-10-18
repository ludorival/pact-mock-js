import type { Method } from 'cypress/types/net-stubbing'

const url = 'https://pact.msw.example.com/api'

function rest({
  method,
  path,
  body = null,
}: {
  method: Method
  path: string
  body?: Cypress.RequestBody
}): Partial<Cypress.RequestOptions> {
  return {
    method,
    url: `${url}${path}`,
    body: body,
  }
}
// define a function to fetch all To-Do items
export function fetchTodos() {
  // return the array of To-Do items
  return rest({ method: 'GET', path: '/todos' })
}

// define a function to fetch all To-Do items
export function todoById(id: string) {
  // return the To-Do items

  return rest({ method: 'GET', path: `/todos/${id}` })
}
// define a function to create a new To-Do item
export function createTodo(title: string, description?: string) {
  // return the newly created To-Do item
  return rest({
    method: 'post',
    path: `/todos`,
    body: { title, description },
  })
}
