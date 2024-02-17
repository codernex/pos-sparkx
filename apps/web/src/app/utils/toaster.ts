import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { ApiError } from '../../redux/types';
export function successToast(message: string) {
  toast.success(message);
}

export function rejectedToast(error: AxiosError<ApiError>) {
  if (error.response?.data) {
    toast.error(error.response.data.message);
  } else if (error.request) {
    toast.error(error.message);
  } else {
    toast.error(error.message);
  }
}
