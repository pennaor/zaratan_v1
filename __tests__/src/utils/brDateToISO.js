export default function brDateToISO(localDate) {
  const [dd, mm, yyyy] = localDate.split('/');
  return `${yyyy}-${mm}-${dd}`;
}
