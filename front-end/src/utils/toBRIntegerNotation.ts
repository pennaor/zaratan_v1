export default (input: string, groupDigitsBeforeIndex = input.length - 1) => {
  let integer = '';
  let count = 1;

  for (let i = groupDigitsBeforeIndex; i >= 0; i -= 1) {
    if (i === 0) {
      integer = input[i] + integer;
      break;
    }
    if (count === 3) {
      integer = `.${input[i]}${integer}`;
      count = 1;
    } else {
      integer = input[i] + integer;
      count += 1;
    }
  }

  return integer;
};
