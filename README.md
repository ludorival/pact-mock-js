<h1 align="center">Welcome to pact-msw 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/ludorival/pact-msw#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/ludorival/pact-msw/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/ludorival/pact-msw/blob/master/LICENSE" target="_blank">
    <img alt="License: BSD--3--Clause" src="https://img.shields.io/github/license/ludorival/pact-msw" />
  </a>
</p>

# pact-msw
`pact-msw` is a Node.js library that allows you to build [Pact](https://docs.pact.io/) contracts by leveraging [msw](https://mswjs.io/). This library provides an easy way to generate contracts that can be used for testing and verifying API interactions between consumer and provider.



## Install

```sh
yarn add -D pact-msw
```

## Usage
Here is an example of how to use pact-msw:

```js
import { setupServer } from 'msw/node';
import { pactProvider, rest } from 'pact-msw';

const server = setupServer();

const provider = pactProvider({
  consumer: 'test-consumer',
  provider: 'test-provider',
});

provider.removePact();

beforeAll(() => {
  server.listen();
  provider.loadPact();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
  provider.writePact();
});

it('get all movies', async () => {
  const mockMovies = rest({
    description: 'a request to list all movies',
    method: 'get',
    path: '*/movies',
    response: [
      {
        id: 1,
        name: 'Movie 1',
        year: 2008,
      },
      {
        id: 2,
        name: 'Movie 2',
        year: 2008,
      },
    ],
  });
  server.use(...provider.toHandlers(mockMovies));

  const movies = await fetchMovies();

  expect(movies).toEqual(mockMovies.response);
});

```

You can find more example to mock
- [A Rest API](./test/rest/rest.client.test.ts)
- [A GraphQL API](./test/graphql/graphql.client.test.ts)

## Author

👤 **Ludovic Dorival**

* Github: [@ludorival](https://github.com/ludorival)

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2021 [Ludovic Dorival](https://github.com/ludorival).<br />
This project is [BSD--3--Clause](https://github.com/ludorival/pact-msw/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_