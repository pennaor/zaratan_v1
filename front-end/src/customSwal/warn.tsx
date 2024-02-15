import { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import NewMain from './main';

export const NewWarn = () => NewMain().mixin({
  title: 'Atenção',
  target: 'main',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Sim',
  confirmButtonColor: '#d32f2f',
  cancelButtonText: 'Não',
  reverseButtons: true,
  focusCancel: true,
  allowOutsideClick: false,
});

export function Warn(
  content: string | JSX.Element,
  options: SweetAlertOptions = {},
): Promise<SweetAlertResult<any>> {
  return NewWarn().mixin({ ...options, html: content }).fire();
}
