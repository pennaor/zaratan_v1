export default (input: string) => {
  let result = '';
  for (let i = 0; i < input.length; i += 1) {
    if (input[i] !== '.') {
      result += input[i];
    }
  }
  return result;
};
