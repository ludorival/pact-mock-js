export interface Todo {
  id: string
  title: string
  description: string
  completed: boolean
}

// Type pour la fonction fetchTodos
export type FetchTodosApi = () => Promise<Todo[]>

// Type pour la fonction todoById
export type TodoByIdApi = (id: string) => Promise<Todo>

// Type pour la fonction createTodo
export type CreateTodoApi = (
  title: string,
  description?: string,
) => Promise<Todo>
