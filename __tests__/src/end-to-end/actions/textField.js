export async function submitTextField(inputHandle, validValue, nextButtonHandle) {
  await inputHandle.clearInput();
  await inputHandle.type(validValue);
  await nextButtonHandle.click(1000);
}

export async function submitAllTextFields(inputsAndValues, nextButtonHandle) {
  if (!inputsAndValues.length) {
    throw new Error('inputs and values must have length greater than 0');
  }
  for (let i = 0; i < inputsAndValues.length; i += 1) {
    const { input, value } = inputsAndValues[i];
    if (!input || value !== "" && !value) {
      throw new Error('input and/or value not founded');
    }
    await input.clearInput();
    await input.type(value);
  }
  await nextButtonHandle.click(1000);
}

export async function resetTextField(inputHandle, validValue, nextButtonHandle) {
  await submitTextField(inputHandle, validValue, nextButtonHandle);
  await inputHandle.clearInput();
}

export async function resetAllTextFields(inputsAndValues, nextButtonHandle) {
  await submitAllTextFields(inputsAndValues, nextButtonHandle);
  for (let i = 0; i < inputsAndValues.length; i += 1) {
    await inputsAndValues[i].input.clearInput();
  }
}

export async function findTextField(handle, selectors) {
  const { label, input, report, constraint } = selectors;
  if (!label || !input || !report) {
    throw new Error('label, input and report selectors are required');
  }
  return {
    label: await handle.findOne(label),
    input: await handle.findOne(input),
    report: await handle.findOne(report),
    constraint: await handle.queryOne(constraint),
  }
}
