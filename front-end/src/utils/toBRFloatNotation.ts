import toBRIntegerNotation from './toBRIntegerNotation';

export default (input: string) => {
  let decimal = '';
  for (let i = input.length - 1; i >= 0; i -= 1) {
    if (input[i] === '.') {
      decimal = `,${decimal}`;
      break;
    }
    decimal = input[i] + decimal;
  }

  let integerEndIndex = input.length - decimal.length - 1;
  if (integerEndIndex <= 0) {
    decimal = '';
    integerEndIndex = input.length - 1;
  }

  return toBRIntegerNotation(input, integerEndIndex) + decimal;
};
