import React, { useState, useEffect } from 'react'
import { Todo, TodoByIdApi } from '../../test/Todo'

// Composant TodoDetails
interface TodoDetailsProps {
  id: string
  todoById: TodoByIdApi
}

const TodoDetails: React.FC<TodoDetailsProps> = ({ id, todoById }) => {
  const [todo, setTodo] = useState<Todo>()
  useEffect(() => {
    todoById(id).then(setTodo)
  }, [])
  return (
    <div>
      <h2>Todo Details</h2>
      <p>
        <strong>Title:</strong> {todo?.title}
      </p>
      <p>
        <strong>Description:</strong>{' '}
        {todo?.description || 'No description available'}
      </p>
    </div>
  )
}

export default TodoDetails
