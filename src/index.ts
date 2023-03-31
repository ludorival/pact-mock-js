'use strict'

export class Example {
  /* Private Instance Fields */

  private logger: Console

  /* Constructor */

  constructor() {
    this.logger = console
  }

  /* Public Instance Methods */

  public exampleMethod(param: string): string {
    this.logger.info('Received: ' + param)
    return param
  }
}
