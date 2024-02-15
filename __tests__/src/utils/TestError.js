export default class TestError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    const splited = this.stack.split('at ');
    this.stack = splited[0] + 'at ' + splited[splited.length - 1];
  }
}
