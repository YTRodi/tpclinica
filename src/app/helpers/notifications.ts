import Swal from 'sweetalert2';

interface ConfirmProps {
  title?: string;
  text?: string;
}

interface Props {
  title?: string;
  text?: string;
  confirmMessage?: string;
  callback?: Function;
  confirmParams?: ConfirmProps;
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
  confirmMessage = 'Confirmar',
  confirmParams,
}: Props): Promise<any> => {
  let confirmed = false;

  try {
    const result = await Swal.fire({
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonText: confirmMessage,
    });

    if (result.isConfirmed) {
      confirmed = true;
      Swal.fire({
        icon: 'success',
        title: confirmParams?.title,
        text: confirmParams?.text,
      });
    }

    return confirmed;
  } catch (error) {
    errorNotification({ text: error.message });
  }
};
