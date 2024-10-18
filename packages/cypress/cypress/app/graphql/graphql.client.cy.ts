/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createTodo, fetchTodos, todoById } from './graphql.client'
import {
  createTodoWillSucceed,
  emptyTodos,
  multipleTodos,
  pact,
  todoByIdFound,
  todoByIdNotFound,
  todosWillRaiseTechnicalFailure,
} from './handlers'

before(() => {
  pact.reset()
})

after(() => {
  const pactFile = pact.generatePactFile()
  cy.writeFile(`pacts/${pact.name}.json`, pactFile)
  cy.fixture('test-consumer-graphql-provider.json').then((expectedPact) => {
    expect(pactFile).to.deep.equal(expectedPact)
  })
})
describe('To-Do list GraphQL API client', () => {
  describe('fetchTodos', () => {
    it('should fetch all To-Do items', () => {
      // use multipleTodos handlers from contracts
      cy.intercept('GET', '*/todos', multipleTodos).as('multipleTodos')

      // call the fetchTodos function and get the actual data
      cy.request(fetchTodos())

      // expect the actual data to match the expected data
      cy.wait('@multipleTodos')
        .its('response')
        .its('statusCode')
        .should('be.equal', 200)
    })

    it('should get a technical failure the first time and an empty todo list', () => {
      // use todosWillRaiseTechnicalFailure and emptyTodos handlers from contracts
      cy.intercept('GET', '*/todos', todosWillRaiseTechnicalFailure).as(
        'todosWillRaiseTechnicalFailure'
      )
      // call first time fetchTodos should return an error

      cy.request(fetchTodos())

      cy.wait('@todosWillRaiseTechnicalFailure')
        .its('response')
        .its('statusMessage')
        .should('be.equal', 'Request failed with status code 500')
      cy.intercept('GET', '*/todos', emptyTodos).as('emptyTodos')

      // call the fetchTodos function and get the actual data
      cy.request(fetchTodos())

      // expect the actual data to match the expected data
      cy.wait('@emptyTodos').its('response.body').should('be.equal', [])
    })
  })

  describe('createTodo', () => {
    it('should create a new To-Do item', () => {
      // use createTodoWillSucceed handlers from contracts
      cy.intercept('POST', '*/todos', createTodoWillSucceed).as(
        'createTodoWillSucceed'
      )

      // call the createTodo function and get the actual data
      cy.request(createTodo('Buy groceries'))

      // expect the actual data to match the status code
      cy.wait('@createTodoWillSucceed')
        .its('response')
        .its('statusCode')
        .should('be.equal', 201)
    })
  })

  describe('todoById', () => {
    it('should get a todo by its id', () => {
      // use todoByIdFound handlers from contracts
      cy.intercept('GET', '*/todos/*', todoByIdFound).as('todoByIdFound')

      // call the todoById function and get the actual data
      cy.request(todoById('1'))

      // expect the actual data to match the expected status code
      cy.wait('@todoByIdFound')
        .its('response')
        .its('statusCode')
        .should('be.equal', 200)
    })

    it('should get an error when getting a todo does not found it', () => {
      // use todoByIdFound handlers from contracts
      cy.intercept('GET', '*/todos/*', todoByIdNotFound).as('todoByIdNotFound')

      // call the todoById function and get the actual data
      cy.request(todoById('1'))
      // expect the actual data to match the expected status code
      cy.wait('@todoByIdNotFound')
        .its('response')
        .its('statusMessage')
        .should('be.equal', 'Request failed with status code 404')
    })
  })
})
