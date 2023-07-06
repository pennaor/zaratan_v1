export default async function onTimeout(value, time) {
  return new Promise((resolve, _) => {
    setTimeout(() => { resolve(value); }, time);
  });
}
