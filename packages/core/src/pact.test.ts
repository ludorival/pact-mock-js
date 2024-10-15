import { PactV2, PactV3, PactV4 } from 'types'
import { Pact } from './pact'
import { readFile } from 'fs/promises'
describe('PactV2', () => {
  const pact = new Pact(
    {
      consumer: { name: 'consumer' },
      provider: { name: 'provider' },
      metadata: { pactSpecification: { version: '2.0.0' } },
    },
    'pacts/v2'
  )

  afterEach(async () => {
    await pact.reset()
  })

  it('should record a Pact V2 Interactions ', async () => {
    // given

    const anInteraction = {
      description: 'This is a description',
      request: { method: 'POST', path: 'v1/todo', body: { name: 'Todo' } },
      response: {
        status: 200,
        body: 'This is an interaction with a description',
      },
    } as PactV2.Interaction

    // when
    await pact.record<string>({
      request: { method: 'GET', path: 'v1/todo' },
      response: {
        status: 200,
        body: 'This is an interaction without description',
      },
    })
    await pact.record(anInteraction)
    await pact.record({
      ...anInteraction,
      description: 'This is a same description',
    })
    await pact.record({
      ...anInteraction,
      description: 'This is a same description',
      request: { method: 'GET', path: 'v1/todo' },
    })
    await pact.record({
      ...anInteraction,
      description: 'Description with special character @/"". $',
    })
    await pact.record({
      ...anInteraction,
      description: 'This is an interaction with matching rules',
      request: {
        ...anInteraction.request,
        matchingRules: { '$.body': { match: 'type' } },
      },
    })

    const pactFile = await pact.generatePactFile()
    expect(pactFile).toMatchSnapshot()
    await readFile(pact.fileName)
  })
})

describe('PactV3', () => {
  const pact = new Pact<PactV3.Interaction>(
    {
      consumer: { name: 'consumer' },
      provider: { name: 'provider' },
      metadata: { pactSpecification: { version: '3.0.0' } },
    },
    'pacts/v3'
  )

  afterEach(async () => {
    await pact.reset()
  })

  it('should record a Pact V3 Interactions ', async () => {
    // given

    const anInteraction = {
      description: 'This is a description',
      request: { method: 'POST', path: 'v1/todo', body: { name: 'Todo' } },
      response: {
        status: 200,
        body: 'This is an interaction with a description',
      },
    } as PactV3.Interaction

    // when
    await pact.record<string>({
      request: { method: 'GET', path: 'v1/todo' },
      response: {
        status: 200,
        body: 'This is an interaction without description',
      },
    })
    await pact.record(anInteraction)
    await pact.record({
      ...anInteraction,
      description: 'This is a same description',
    })
    await pact.record({
      ...anInteraction,
      description: 'This is a same description',
      request: { method: 'GET', path: 'v1/todo' },
    })
    await pact.record({
      ...anInteraction,
      description: 'Description with special character @/"". $',
    })
    await pact.record({
      ...anInteraction,
      description: 'This is an interaction with matching rules',
      request: {
        ...anInteraction.request,
        matchingRules: { body: { match: 'type' } },
      },
    })

    const pactFile = await pact.generatePactFile()
    expect(pactFile).toMatchSnapshot()
    await readFile(pact.fileName)
  })
})

describe('PactV4', () => {
  const pact = new Pact<PactV4.Interaction>(
    {
      consumer: { name: 'consumer' },
      provider: { name: 'provider' },
      metadata: { pactSpecification: { version: '4.0.0' } },
    },
    'pacts/v4'
  )

  afterEach(async () => {
    await pact.reset()
  })

  it('should record a Pact V4 Interactions ', async () => {
    // given

    const anInteraction = {
      type: 'Synchronous/HTTP',
      description: 'This is a description',
      request: {
        method: 'POST',
        path: 'v1/todo',
        body: { content: { name: 'Todo' }, contentType: 'application/json' },
      },
      response: {
        body: {
          content: 'This is an interaction with a description',
          contentType: 'application/json',
        },
      },
    } as PactV4.Interaction

    // when
    await pact.record<string>({
      request: { method: 'GET', path: 'v1/todo' },
      response: {
        status: 200,
        body: {
          content: 'This is an interaction without description',
          contentType: 'application/json',
        },
      },
    })
    await pact.record(anInteraction)
    await pact.record({
      ...anInteraction,
      description: 'This is a same description',
    })
    await pact.record({
      ...anInteraction,
      description: 'This is a same description',
      request: { method: 'GET', path: 'v1/todo' },
    })
    await pact.record({
      ...anInteraction,
      description: 'Description with special character @/"". $',
    })
    await pact.record({
      ...anInteraction,
      description: 'This is an interaction with matching rules',
      request: {
        ...anInteraction.request,
        matchingRules: { body: { match: 'type' } },
      },
    })

    const pactFile = await pact.generatePactFile()
    expect(pactFile).toMatchSnapshot()
    await readFile(pact.fileName)
  })
})
