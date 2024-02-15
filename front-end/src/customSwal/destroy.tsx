import NewMain from './main';

export default function Destroy() {
  return NewMain({
    timer: 0.1,
    toast: true,
    customClass: { container: 'on-timeout-close' },
    willClose: () => { document.querySelector('body')?.classList.remove('swal2-shown'); },
  })
    .fire();
}
