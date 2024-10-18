const url = 'https://pact.msw.example.com/graphql'

function graphql<TVariables = unknown>({
  query,
  variables,
}: {
  query: string
  variables?: TVariables
}): Partial<Cypress.RequestOptions> {
  return {
    method: 'POST',
    url,
    body: { query, variables },
  }
}
// define a function to fetch all To-Do items
export function fetchTodos() {
  // define the GraphQL query
  const query = `
    query todos {
      todos {
        id
        title
        description
        completed
      }
    }
  `

  // execute the query and get the data
  return graphql({ query })
}

// define a function to fetch all To-Do items
export function todoById(id: string) {
  // define the GraphQL query
  const query = `
    query todoById($id: ID) {
      todoById(id: $id) {
        id
        title
        description
        completed
      }
    }
  `

  // execute the query and get the data
  return graphql<{ id: string }>({
    query,
    variables: { id },
  })
}
// define a function to create a new To-Do item
export function createTodo(title: string, description?: string) {
  // define the GraphQL mutation
  const query = `
    mutation createTodo($title: String!, $description: String) {
      createTodo(input: { title: $title, description: $description }) {
        id
        title
        description
        completed
      }
    }
  `

  // execute the mutation and get the data
  return graphql<{ title: string; description?: string }>({
    query,
    variables: { title, description },
  })
}
