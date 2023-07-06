import SweetAlert2, { SweetAlertOptions } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './style.css';

const Swal = withReactContent(SweetAlert2);

const NewMain = (options: SweetAlertOptions = {}) => Swal.mixin({
  width: '25em',
  confirmButtonColor: '#38c593',
  customClass: { container: 'swal-container', htmlContainer: 'swal-htmlContainer' },
  ...options,
});

export default NewMain;
