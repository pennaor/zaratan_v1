import { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import NewMain from './main';

export const NewInform = () => NewMain().mixin({
  icon: 'info',
});

export function Inform(
  content?: string | JSX.Element,
  options: SweetAlertOptions = {},
): Promise<SweetAlertResult<any>> {
  return NewInform().mixin({ ...options, html: content }).fire();
}
