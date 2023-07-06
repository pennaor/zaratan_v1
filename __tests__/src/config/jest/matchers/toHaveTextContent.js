const { throwIfInvalidDecoratedHandle } = require('./utils');

module.exports = function toHaveTextContent(received, expected, caseSensitive = false) {
  throwIfInvalidDecoratedHandle(received, this);

  const normalizedText = received.element.textContent.replace(/\s+/g, ' ').trim();

  let matched = normalizedText === expected;

  if (!matched && normalizedText !== '' && expected !== '') {
    if (caseSensitive) {
      matched = normalizedText.includes(expected);
    } else {
      matched = normalizedText.toLowerCase().includes(expected.toLowerCase());
    }
  }

  return {
    pass: matched,
    message: () => {
      if (!matched) {
        return `Expected: ${this.utils.printExpected(expected)}\n` +
                `Received: ${this.utils.printReceived(normalizedText)}`
      }
      return `Expected: not ${this.utils.printExpected(expected)}\n` +
              `Received: ${this.utils.printReceived(normalizedText)}`
    }
  }
}
