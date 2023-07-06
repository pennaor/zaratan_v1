import onTimeout from '../helpers/onTimeout';

function trimExpandIcons(expandIconsHandle) {
  const [_first, ...last] = expandIconsHandle;
  return last;
}

export default async function expandViewer(expandIconsHandle) {
  const trimmedIcons = trimExpandIcons(expandIconsHandle);
  return Promise.all(
    trimmedIcons.map(
      (iconHandle, index) => onTimeout(iconHandle, index * 500)
        .then((iconHandle) => iconHandle.click()),
    ),
  );
}
