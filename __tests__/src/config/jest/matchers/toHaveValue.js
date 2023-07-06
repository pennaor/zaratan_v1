const { throwIfInvalidDecoratedHandle, TestError } = require('./utils');

module.exports = function toHaveValue(received, expected) {
  throwIfInvalidDecoratedHandle(received, this);

  if (received.element.tagName !== 'INPUT' && received.element.tagName !== 'TEXTAREA') {
    throw new TestError(
      'DecoratedHandle\'s element must be an input or textarea\n' +
        `Received: ${this.utils.printReceived(received.element.tagName.toLowerCase())}`
    );
  }

  const pass = received.element.value === expected;
  return {
    pass,
    message: () => {
      if (!pass) {
        return `Expected: ${this.utils.printExpected(expected)}\n` +
                `Received: ${this.utils.printReceived(received.element.value)}`
      }
      return `Expected: not ${this.utils.printExpected(expected)}\n` +
              `Received: ${this.utils.printReceived(received.element.value)}`
    }
  }
}
