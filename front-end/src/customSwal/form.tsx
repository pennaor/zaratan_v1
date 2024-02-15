import { SweetAlert2 } from 'sweetalert2-react-content';
import { SweetAlertOptions } from 'sweetalert2';
import NewMain from './main';

export default function NewForm(
  content?: JSX.Element,
  options: SweetAlertOptions = {},
): SweetAlert2 {
  return NewMain().mixin({
    ...options,
    html: content,
    showCloseButton: false,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    heightAuto: false,
  });
}
