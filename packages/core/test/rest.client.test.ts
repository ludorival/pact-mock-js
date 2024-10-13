import axios from 'axios';
import { fetchTodos, todoById, createTodo } from './rest.client'; // Adjust the path if necessary
import { createTodoWillSucceed, multipleTodos, todoByIdFound, todoByIdNotFound, todosWillRaiseTechnicalFailure } from './mock';

jest.mock('axios'); // Mocking axios
const mockedAxios = axios as jest.Mocked<typeof axios>;

afterEach(() => {
  jest.clearAllMocks()
})


describe('To-Do list Rest API client', () => {
  describe('fetchTodos', () => {
    it('should fetch all To-Do items', async () => {
      // use multipleTodos handlers from contracts
    

      mockedAxios.get.mockImplementation(() =>  Promise.resolve(multipleTodos.response.body))
     
      // call the fetchTodos function and get the actual data
      const actualData = await fetchTodos()

      // expect the actual data to match the expected data
      expect(actualData).toEqual(multipleTodos.response)
    })

    it('should get a technical failure the first time and an empty todo list', async () => {
      // use todosWillRaiseTechnicalFailure and emptyTodos handlers from contracts
      mockedAxios.get.mockImplementationOnce(() => Promise.reject(todosWillRaiseTechnicalFailure.response))

      // call first time fetchTodos should return an error
      expect.assertions(2)
      fetchTodos().catch((e) =>
        expect(e).toMatchObject({
          message: 'Request failed with status code 500',
        })
      )
      // call the fetchTodos function and get the actual data
      const actualData = await fetchTodos()

      // expect the actual data to match the expected data
      expect(actualData).toEqual([])
    })
  })

  describe('createTodo', () => {
    it('should create a new To-Do item', async () => {
      // use createTodoWillSucceed handlers from contracts
      mockedAxios.get.mockImplementation(() => Promise.resolve(createTodoWillSucceed.response.body))

      // call the createTodo function and get the actual data
      const actualData = await createTodo(createTodoWillSucceed.response!.title)

      // expect the actual data to match the expected data
      expect(actualData).toEqual(createTodoWillSucceed.response)
    })
  })

  describe('todoById', () => {
    it('should get a todo by its id', async () => {
      // use todoByIdFound handlers from contracts
      mockedAxios.get.mockImplementation(() => Promise.resolve(todoByIdFound.response.body))

      // call the todoById function and get the actual data
      const actualData = await todoById(todoByIdFound.response!.id)

      // expect the actual data to match the expected data
      expect(actualData).toEqual(todoByIdFound.response)
    })

    it('should get an error when getting a todo does not found it', async () => {
      // use todoByIdFound handlers from contracts
      mockedAxios.get.mockImplementation(() => Promise.resolve(todoByIdNotFound.response.body))

      // call the todoById function and get the actual data
      try {
        await todoById('1')
        fail('Should never reach')
      } catch (e: unknown) {
        expect(e).toMatchObject({
          response: { data: { message: 'The todo item 1 is not found' } },
          message: 'Request failed with status code 404',
        })
      }
    })
  })
})
