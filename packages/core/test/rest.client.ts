import axios from 'axios'

const url = 'https://pact.msw.example.com/api'
export interface Todo {
  id: string
  title: string
  description: string
  completed: boolean
}

async function get<TData>(path: string): Promise<TData> {

  const { data: response } = await axios.get<TData>(path)

  return response
}

async function post<TData, TVariables = unknown>(path: string, body: TVariables): Promise<TData> {

  const { data: response } = await axios.post<TData>(path, body)

  return response
}
// define a function to fetch all To-Do items
export async function fetchTodos(): Promise<Todo[]> {
  // return the array of To-Do items
  return await get('/todos')
}

// define a function to fetch all To-Do items
export async function todoById(id: string): Promise<Todo> {
  // return the To-Do items

  return await get(`/todos/${id}`)
}
// define a function to create a new To-Do item
export async function createTodo(title: string, description?: string) {
  // return the newly created To-Do item
  return await post(`/todos`,
    { title, description },
  )
}
