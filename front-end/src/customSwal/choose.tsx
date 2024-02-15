import { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import NewMain from './main';

export const NewChoose = () => NewMain().mixin({
  icon: 'question',
  showDenyButton: true,
  denyButtonColor: '#38c593',
  focusConfirm: false,
  showCloseButton: true,
});

export function Choose(
  question: string | JSX.Element,
  optionOne: string,
  optionTwo: string,
  swalOptions: SweetAlertOptions = {},
): Promise<SweetAlertResult<any>> {
  return NewChoose()
    .mixin({
      ...swalOptions,
      title: question,
      confirmButtonText: optionOne,
      denyButtonText: optionTwo,
    })
    .fire();
}
