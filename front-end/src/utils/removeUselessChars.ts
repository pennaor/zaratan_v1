export default (input: string): string => {
  let init = 0;
  for (let i = 0; i < input.length; i += 1) {
    if (input[i] !== ' ' && input[i] !== '\n') break;
    init += 1;
  }

  let end = input.length - 1;
  for (let i = input.length - 1; input.length > 0; i -= 1) {
    if (input[i] !== ' ' && input[i] !== '\n') break;
    end -= 1;
  }

  let newStr = '';
  let whiteSpaceCount = 0;
  for (let i = init; i <= end; i += 1) {
    if (input[i] !== ' ') {
      newStr += input[i];
      whiteSpaceCount = 0;
    } else {
      whiteSpaceCount += 1;
    }
    if (whiteSpaceCount === 1) {
      newStr += input[i];
    }
  }

  return newStr;
};
