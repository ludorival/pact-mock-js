import axios from 'axios'
const url = 'https://pact.msw.example.com/base/api'
export const fetchMovies = async () => {
  const response = await axios.get(`${url}/movies`).then((res) => res.data)
  return response
}

export const deleteMovie = async (id: string) => {
  const response = await axios
    .delete(`${url}/movie/${id}`)
    .then((res) => res.data)
  return response
}
