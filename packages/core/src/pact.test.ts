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
    expect(pactFile).toMatchInlineSnapshot(`
    {
      "consumer": {
        "name": "consumer",
      },
      "interactions": [
        {
          "description": "Description with special character @/"". $",
          "request": {
            "body": {
              "name": "Todo",
            },
            "method": "POST",
            "path": "v1/todo",
          },
          "response": {
            "body": "This is an interaction with a description",
            "status": 200,
          },
        },
        {
          "description": "GET v1/todo returns status 200",
          "request": {
            "method": "GET",
            "path": "v1/todo",
          },
          "response": {
            "body": "This is an interaction without description",
            "status": 200,
          },
        },
        {
          "description": "This is a description",
          "request": {
            "body": {
              "name": "Todo",
            },
            "method": "POST",
            "path": "v1/todo",
          },
          "response": {
            "body": "This is an interaction with a description",
            "status": 200,
          },
        },
        {
          "description": "This is a same description",
          "request": {
            "method": "GET",
            "path": "v1/todo",
          },
          "response": {
            "body": "This is an interaction with a description",
            "status": 200,
          },
        },
        {
          "description": "This is an interaction with matching rules",
          "request": {
            "body": {
              "name": "Todo",
            },
            "matchingRules": {
              "$.body": {
                "match": "type",
              },
            },
            "method": "POST",
            "path": "v1/todo",
          },
          "response": {
            "body": "This is an interaction with a description",
            "status": 200,
          },
        },
      ],
      "metadata": {
        "pactSpecification": {
          "version": "2.0.0",
        },
      },
      "provider": {
        "name": "provider",
      },
    }
    `)
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
    expect(pactFile).toMatchInlineSnapshot(`
    {
      "consumer": {
        "name": "consumer",
      },
      "interactions": [
        {
          "description": "Description with special character @/"". $",
          "request": {
            "body": {
              "name": "Todo",
            },
            "method": "POST",
            "path": "v1/todo",
          },
          "response": {
            "body": "This is an interaction with a description",
            "status": 200,
          },
        },
        {
          "description": "GET v1/todo returns status 200",
          "request": {
            "method": "GET",
            "path": "v1/todo",
          },
          "response": {
            "body": "This is an interaction without description",
            "status": 200,
          },
        },
        {
          "description": "This is a description",
          "request": {
            "body": {
              "name": "Todo",
            },
            "method": "POST",
            "path": "v1/todo",
          },
          "response": {
            "body": "This is an interaction with a description",
            "status": 200,
          },
        },
        {
          "description": "This is a same description",
          "request": {
            "method": "GET",
            "path": "v1/todo",
          },
          "response": {
            "body": "This is an interaction with a description",
            "status": 200,
          },
        },
        {
          "description": "This is an interaction with matching rules",
          "request": {
            "body": {
              "name": "Todo",
            },
            "matchingRules": {
              "body": {
                "match": "type",
              },
            },
            "method": "POST",
            "path": "v1/todo",
          },
          "response": {
            "body": "This is an interaction with a description",
            "status": 200,
          },
        },
      ],
      "metadata": {
        "pactSpecification": {
          "version": "3.0.0",
        },
      },
      "provider": {
        "name": "provider",
      },
    }
    `)
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
    expect(pactFile).toMatchInlineSnapshot(`
    {
      "consumer": {
        "name": "consumer",
      },
      "interactions": [
        {
          "description": "Description with special character @/"". $",
          "request": {
            "body": {
              "content": {
                "name": "Todo",
              },
              "contentType": "application/json",
            },
            "method": "POST",
            "path": "v1/todo",
          },
          "response": {
            "body": {
              "content": "This is an interaction with a description",
              "contentType": "application/json",
            },
          },
          "type": "Synchronous/HTTP",
        },
        {
          "description": "GET v1/todo returns status 200",
          "request": {
            "method": "GET",
            "path": "v1/todo",
          },
          "response": {
            "body": {
              "content": "This is an interaction without description",
              "contentType": "application/json",
            },
            "status": 200,
          },
        },
        {
          "description": "This is a description",
          "request": {
            "body": {
              "content": {
                "name": "Todo",
              },
              "contentType": "application/json",
            },
            "method": "POST",
            "path": "v1/todo",
          },
          "response": {
            "body": {
              "content": "This is an interaction with a description",
              "contentType": "application/json",
            },
          },
          "type": "Synchronous/HTTP",
        },
        {
          "description": "This is a same description",
          "request": {
            "method": "GET",
            "path": "v1/todo",
          },
          "response": {
            "body": {
              "content": "This is an interaction with a description",
              "contentType": "application/json",
            },
          },
          "type": "Synchronous/HTTP",
        },
        {
          "description": "This is an interaction with matching rules",
          "request": {
            "body": {
              "content": {
                "name": "Todo",
              },
              "contentType": "application/json",
            },
            "matchingRules": {
              "body": {
                "match": "type",
              },
            },
            "method": "POST",
            "path": "v1/todo",
          },
          "response": {
            "body": {
              "content": "This is an interaction with a description",
              "contentType": "application/json",
            },
          },
          "type": "Synchronous/HTTP",
        },
      ],
      "metadata": {
        "pactSpecification": {
          "version": "4.0.0",
        },
      },
      "provider": {
        "name": "provider",
      },
    }
    `)
    await readFile(pact.fileName)
  })
})
