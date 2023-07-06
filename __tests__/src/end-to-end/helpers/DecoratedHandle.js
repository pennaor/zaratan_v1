import options from '../../config/jest/puppeteerOptions';
import TestError from '../../utils/TestError';

class DecoratedHandleError extends TestError {
  constructor(message) {
    super(message);
    this.name = 'DecoratedHandleError';
  }
}

export default class DecoratedHandle {
  static currentId = 0;

  constructor(page, ...elementProps) {
    this.handle = page;

    this.elementProps = [...options.decoratedHandle.elementProps, ...elementProps];
    this.element = null;

    DecoratedHandle.currentId += 1;
    this.id = DecoratedHandle.currentId;

    this.linkedHandles = [];
    this.findTimeout = options.decoratedHandle.timeout > 1000 ? options.decoratedHandle.timeout : 1000;
  }

  extendLinkedHandles(decoratedHandle) {
    this.linkedHandles.push(decoratedHandle);
    decoratedHandle.linkedHandles = this.linkedHandles
  }
  
  unlink() {
    const thisIndex = this.linkedHandles.findIndex((linked) => linked.id === this.id);
    this.linkedHandles.splice(thisIndex, 1);
    this.linkedHandles = [];
  }

  #newElement = async (element, elementProps) => {
    if (!document.contains(element)) {
      return null;
    }
    const keys = new Array().concat(elementProps);
    const props = {};
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      props[key] = element[key] ?? null;
    }
    return props;
  }

  async setElement(props = this.elementProps) {
    const evaluation = await this.handle.evaluate(this.#newElement, props);
    if (!evaluation) {
      this.element = null;
      return this.unlink();
    }
    this.element = evaluation;
  }

  async updateLinkedHandles() {
    await Promise.all(this.linkedHandles.map((handle) => handle.setElement()));
  }

  async newEvaluatedHandle(jsHandle, ...elementProps) {
    const decoratedHandle = new DecoratedHandle(jsHandle, ...elementProps);
    const mixinProps = [...this.elementProps, ...elementProps];
    await decoratedHandle.setElement(mixinProps);
    return decoratedHandle;
  }

  async findOne(selector, ...elementProps) {
    try {
      const selectedHandle = await this.handle.waitForSelector(selector, { timeout: this.findTimeout });
      const decoratedHandle = await this.newEvaluatedHandle(selectedHandle, elementProps);
      this.extendLinkedHandles(decoratedHandle);
      return decoratedHandle;
    } catch (error) {
      throw new DecoratedHandleError(error.message);
    }
  }

  async findAll(selector, ...elementProps) {
    let selectionHandles = [];

    const timeout = Date.now() + this.findTimeout;
    while (timeout > Date.now() && !selectionHandles.length) {
      selectionHandles = await this.handle.$$(selector);
    }

    if (!selectionHandles.length) {
      throw new DecoratedHandleError(
        `waiting for selector \`${selector}\` failed: timeout ${this.findTimeout}ms exceeded`,
      );
    }

    const decoratedHandles = await Promise.all(selectionHandles.map(async (selectedHandle) => {
      return this.newEvaluatedHandle(selectedHandle, elementProps)
        .then((decoratedHandle) => {
          this.extendLinkedHandles(decoratedHandle);
          return decoratedHandle;
        });
    }));
    return decoratedHandles;
  }

  async queryOne(selector, ...elementProps) {
    let selectedHandle = await this.handle.$(selector);
    if (selectedHandle) {
      const decoratedHandle = await this.newEvaluatedHandle(selectedHandle, elementProps);
      this.extendLinkedHandles(decoratedHandle);
      return decoratedHandle;
    }
    return null;
  }

  async queryAll(selector, ...elementProps) {
    let selectedHandles = await this.handle.$$(selector);
    if (selectedHandles.length) {
      selectedHandles = await Promise.all(selectedHandles.map(async (handle) => {
        return this.newEvaluatedHandle(handle, elementProps)
        .then((decoratedHandle) => {
          this.extendLinkedHandles(decoratedHandle);
          return decoratedHandle;
        });
      }));
    }
    return selectedHandles;
  }

  async scrollIntoView() {
    await this.handle.evaluate((e) => e.scrollIntoView({ block: 'center' }));
  }

  async click(updateAfterMilliseconds = 0) {
    await this.scrollIntoView();
    await this.handle.click();
    await this.waitForTimeout(updateAfterMilliseconds);
    await this.updateLinkedHandles();
  }

  async type(value) {
    await this.scrollIntoView();
    await this.handle.type(value);
    await this.updateLinkedHandles();
  }

  async waitForTimeout(milliseconds) {
    return new Promise((resolve, _) => {
      setTimeout(() => resolve(), milliseconds);
    });
  }

  async clearInput() {
    if (this.element.tagName !== 'INPUT' && this.element.tagName !== 'TEXTAREA') {
      throw new DecoratedHandleError('handle\'s element is not an input neither textarea');
    }

    await this.scrollIntoView();
    if (this.element.value === '') {
      return;
    }

    await this.handle.focus();

    if (this.element.type === 'date') {
      await this.handle.press('Backspace');
      await this.handle.press('Tab');
      await this.handle.press('Backspace');
      await this.handle.press('Tab');
      await this.handle.press('Backspace');
      await this.handle.press('Tab');
    } else {
      let promises = [];
      for (let i = 0; i < this.element.value.length; i += 1) {
        promises.push(this.handle.press('ArrowRight'));
      }
      await Promise.all(promises);

      promises = [];
      for (let i = 0; i < this.element.value.length; i += 1) {
        promises.push(this.handle.press('Backspace'));
      }
      await Promise.all(promises);
    }

    await this.updateLinkedHandles();
  }
}
