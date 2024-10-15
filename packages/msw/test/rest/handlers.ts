import { Pact } from '@pact-mock-js/msw'
import { rest } from 'msw'

export const pact = new Pact(
  {
    consumer: { name: 'test-consumer' },
    provider: { name: 'rest-provider' },
    metadata: { pactSpecification: { version: '2.0.0' } },
  },
  {
    outputDir: 'pacts/rest',
    basePath: '/base',
    headersConfig: {
      includes: ['content-type'],
    },
  }
)
export const todosWillRaiseTechnicalFailure = rest.get(
  '*/todos',
  async (req, res, ctx) =>
    res.once(
      ...(await pact.toTransformers(
        {
          providerState: 'will return a 500 http error',
          description: 'graphql api returns a 500 http error',
          response: {
            status: 500,
          },
        },
        req,
        ctx
      ))
    )
)
export const emptyTodos = rest.get('*/todos', async (req, res, ctx) =>
  res(
    ...(await pact.toTransformers(
      {
        description: 'empty todo list',
        response: {
          status: 200,
          body: [],
        },
      },
      req,
      ctx
    ))
  )
)

export const multipleTodos = rest.get('*/todos', async (req, res, ctx) =>
  res(
    ...(await pact.toTransformers(
      {
        description: 'multiple todo list',
        response: {
          status: 200,
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
      },
      req,
      ctx
    ))
  )
)

export const todoByIdFound = rest.get('*/todos/*', async (req, res, ctx) =>
  res(
    ...(await pact.toTransformers(
      {
        description: 'should found a todo item by its id',
        providerState: 'there is an existing todo item with this id',
        response: {
          status: 200,
          body: {
            id: '1',
            title: 'Buy groceries',
            description: 'Milk, bread, eggs, cheese',
            completed: false,
          },
        },
      },
      req,
      ctx
    ))
  )
)

export const todoByIdNotFound = rest.get('*/todos/*', async (req, res, ctx) =>
  res(
    ...(await pact.toTransformers(
      {
        description: 'should not found a todo item by its id',
        response: {
          status: 404,
          body: { message: 'The todo item 1 is not found' },
        },
      },
      req,
      ctx
    ))
  )
)

export const createTodoWillSucceed = rest.post(
  '*/todos',
  async (req, res, ctx) =>
    res(
      ...(await pact.toTransformers(
        {
          description: 'should create a Todo with success',
          response: {
            status: 201,
            body: {
              id: '1',
              title: 'Buy groceries',
              description: 'Milk, bread, eggs, cheese',
              completed: false,
            },
          },
        },
        req,
        ctx
      ))
    )
)
