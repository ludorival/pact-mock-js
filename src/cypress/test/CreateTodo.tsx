import React, { useState } from 'react'
import { CreateTodoApi } from '../../test/Todo'

// Composant CreateTodo
interface CreateTodoProps {
  createTodo: CreateTodoApi
  onTodoCreated?: () => void
}

const CreateTodo: React.FC<CreateTodoProps> = ({
  onTodoCreated,
  createTodo,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [newTodoDescription, setNewTodoDescription] = useState('')

  // Fonction pour gérer la création d'un nouveau To-Do
  const handleCreateTodo = async () => {
    if (newTodoTitle.trim()) {
      await createTodo(newTodoTitle, newTodoDescription)
      onTodoCreated?.() // Notifie le composant parent pour mettre à jour la liste des To-Dos
      setNewTodoTitle('') // Réinitialise le champ
      setNewTodoDescription('') // Réinitialise le champ
    }
  }

  return (
    <div>
      <h2>Create a New Todo</h2>
      <input
        id="title"
        type="text"
        placeholder="New Todo Title"
        value={newTodoTitle}
        onChange={(e) => setNewTodoTitle(e.target.value)}
      />
      <input
        id="description"
        type="text"
        placeholder="New Todo Description"
        value={newTodoDescription}
        onChange={(e) => setNewTodoDescription(e.target.value)}
      />
      <button id="submit" onClick={handleCreateTodo}>
        Add Todo
      </button>
    </div>
  )
}

export default CreateTodo
