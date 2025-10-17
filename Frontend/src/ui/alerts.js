import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Detect palette from CSS files we saw: greens/teals and blue accents
// We'll define a consistent theme based on these tokens
export const palette = {
  primary: '#78c257', // lime/green accent used across Sesiones
  primaryDark: '#2d5f6f', // teal/dark blue gradient start
  secondary: '#0099cc', // primary-blue in Inicio CSS
  text: '#1f2937',
};

export const baseSwal = Swal.mixin({
  confirmButtonColor: palette.primary,
  cancelButtonColor: palette.secondary,
  color: palette.text,
  customClass: {
    confirmButton: 'swal2-confirm-btn',
    cancelButton: 'swal2-cancel-btn',
    popup: 'swal2-popup-themed',
  },
});

export const MySwal = withReactContent(baseSwal);

export function alertSuccess(title, text) {
  return MySwal.fire({ icon: 'success', title, text });
}

export function alertError(title, text) {
  return MySwal.fire({ icon: 'error', title, text });
}

export function alertInfo(title, text) {
  return MySwal.fire({ icon: 'info', title, text });
}

export function confirm(title, text, confirmText = 'Aceptar', cancelText = 'Cancelar') {
  return MySwal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
  });
}
