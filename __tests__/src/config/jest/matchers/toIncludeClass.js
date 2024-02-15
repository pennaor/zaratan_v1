const { throwIfInvalidDecoratedHandle } = require('./utils');

module.exports = function toIncludeClass(received, expected) {
  throwIfInvalidDecoratedHandle(received, this);

  const includes = received.element.className.includes(expected);
  return {
    pass: includes,
    message: () => {
      if (!includes) {
        return `Expected: ${this.utils.printExpected(expected)}\n` +
                `Received: ${this.utils.printReceived(received.element.className)}`
      }
      return `Expected: not include ${this.utils.printExpected(expected)}\n` +
              `Received: ${this.utils.printReceived(received.element.className)}`
    }
  }
}
