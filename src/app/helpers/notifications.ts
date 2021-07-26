import Swal from 'sweetalert2';

interface Props {
  title?: string;
  text?: string;
  confirmMessage?: string;
  callback?: Function;
}

export const successNotification = ({ title, text }: Props) => {
  return Swal.fire({ icon: 'success', title, text });
};

export const errorNotification = ({ title = 'Oops...', text }: Props) => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    showCloseButton: true,
    showConfirmButton: false,
  });
};

export const confirmNotification = async ({
  title = '¿Estás seguro?',
  text,
  confirmMessage: confirmButtonText = 'Confirmar',
}: Props): Promise<any> => {
  let confirmed = false;

  try {
    const result = await Swal.fire({
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      confirmButtonColor: '#4785FF',
      cancelButtonColor: '#DC3545',
      confirmButtonText: confirmButtonText,
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      confirmed = true;
    }

    return confirmed;
  } catch (error) {
    errorNotification({ text: error.message });
  }
};
