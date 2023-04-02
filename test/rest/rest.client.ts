import axios from 'axios'
import { Method } from 'pact-msw'
import { Todo } from '../Todo'

const url = 'https://pact.msw.example.com/api'

async function rest<TData, TVariables = unknown>({
  method,
  path,
  body,
}: {
  method: Method
  path: string
  body?: TVariables
}): Promise<TData> {
  const { data: response } = await axios<TData>({
    method,
    url: `${url}${path}`,
    data: body,
  })

  return response
}
// define a function to fetch all To-Do items
export async function fetchTodos(): Promise<Todo[]> {
  // return the array of To-Do items
  return await rest({ method: 'get', path: '/todos' })
}

// define a function to fetch all To-Do items
export async function todoById(id: string): Promise<Todo> {
  // return the To-Do items

  return await rest({ method: 'get', path: `/todos/${id}` })
}
// define a function to create a new To-Do item
export async function createTodo(title: string, description?: string) {
  // return the newly created To-Do item
  return await rest({
    method: 'post',
    path: `/todos`,
    body: { title, description },
  })
}
