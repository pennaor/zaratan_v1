export default (date?: string | null) => {
  if (!date) {
    return '';
  }

  const splited = date.split('-');
  if (splited.length !== 3) {
    return '';
  }

  const [year, month, day] = splited;
  return `${day}/${month}/${year}`;
};
