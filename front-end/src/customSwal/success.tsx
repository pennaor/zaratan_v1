import { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import NewMain from './main';

export const NewSuccess = () => NewMain().mixin({
  title: 'Sucesso',
  icon: 'success',
});

export function Success(
  content?: string | JSX.Element,
  options: SweetAlertOptions = {},
): Promise<SweetAlertResult<any>> {
  return NewSuccess().mixin({ ...options, html: content }).fire();
}
