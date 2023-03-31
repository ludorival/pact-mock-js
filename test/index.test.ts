'use strict'

import { Example } from '../src/index'
describe('Example class', () => {
  test('should create an instance using its constructor', () => {
    const example: Example = new Example()
    expect(example).toBeDefined // tslint:disable-line:no-unused-expression
  })
  test('should return whatever is passed to exampleMethod()', () => {
    const example: Example = new Example()
    const param = 'This is my param.'
    const returnValue: string = example.exampleMethod(param)
    expect(returnValue).toBe(param)
  })
})
