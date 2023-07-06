const { throwIfInvalidDecoratedHandle, TestError } = require('./utils');

const disableableElements = [
  'FIELDSET',
  'INPUT',
  'SELECT',
  'OPTGROUP',
  'OPTION',
  'BUTTON',
  'TEXTAREA',
];

function toBeDisabled(received) {
  throwIfInvalidDecoratedHandle(received, this);

  if (!disableableElements.includes(received.element.tagName)) {
    throw new TestError(
      'DecoratedHandle\'s element cannot be disabled\n' +
        `Received: ${this.utils.printReceived(received.element.tagName.toLowerCase())}`
    );
  }

  const expected = true;
  const pass = received.element.disabled === expected;
  return {
    pass,
    message: () => {
      if (!pass) {
        return `Expected: element to be ${this.utils.printExpected('disabled')}\n` +
                `Received: element ${this.utils.printReceived('is enabled')}`;
      }
      return `Expected: element to be ${this.utils.printExpected('not disabled')}\n` +
              `Received: element ${this.utils.printReceived('is disabled')}`;
    }
  }
}

function toBeEnabled(received) {
  throwIfInvalidDecoratedHandle(received, this);

  if (!disableableElements.includes(received.element.tagName)) {
    throw new TestError(
      'DecoratedHandle\'s element cannot be disabled\n' +
        `Received: ${this.utils.printReceived(received.element.tagName.toLowerCase())}`
    );
  }

  const expected = false;
  const pass = received.element.disabled === expected;
  return {
    pass,
    message: () => {
      if (!pass) {
        return `Expected: element to be ${this.utils.printExpected('enabled')}\n` +
                `Received: element ${this.utils.printReceived('is disabled')}`;
      }
      return `Expected: element to be ${this.utils.printExpected('not enabled')}\n` +
              `Received: element ${this.utils.printReceived('is enabled')}`;
    }
  }
}

module.exports = { toBeDisabled, toBeEnabled };
