const { DecoratedHandle } = require('../../../end-to-end/helpers');
import TestError from '../../../utils/TestError';

function throwIfInvalidDecoratedHandle (received, jestMatcher) {
  if (!(received instanceof DecoratedHandle)) {
    throw new TestError(
      `Expected: ${jestMatcher.utils.printExpected('DecoratedHandle')}\n` +
        `Received: ${jestMatcher.utils.printReceived(typeof received)}`
    );
  }
  if (!received.element) {
    throw new TestError('DecoratedHandle instance has not evaluated yet');
  }
}

module.exports = { throwIfInvalidDecoratedHandle, TestError };
