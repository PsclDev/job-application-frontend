import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_URL } from '@module/common/config';
import { NotificationType, notifications, notify } from '@global/NotificationPlugin';
import { isForbidden, isInternalServerError, isUnauthorized, mapErrors } from '@module/common/utils/requestUtils';

export const statusCodesToHandle = [400, 401, 422];

axios.defaults.baseURL = API_URL;

export function requestInterceptor(config: AxiosRequestConfig): AxiosRequestConfig {
  if (!config.headers) {
    config.headers = {};
  }

  config.headers.Accept = 'application/vnd.api+json';

  return config;
}

axios.interceptors.request.use(requestInterceptor);

export function successInterceptor(response: AxiosResponse): AxiosResponse {
  return response.data;
}

interface CustomAxiosError extends AxiosError {
  handled: boolean
  errors: any
  status: number
}

export async function errorInterceptor(error: CustomAxiosError) {
  // Happens for cancelled requests using axios CancelTokenSource
  if (!error.response) {
    return Promise.reject(error);
  }

  const { status } = error.response;
  let errors = '';

  if (statusCodesToHandle.includes(status)) {
    errors = mapErrors(error.response.data);
    if (errors === 'Unauthenticated.') {
      errors = 'Your session expired. Please login in again to use the application';
    }

    if (notifications.state.length === 0) {
      notify({
        type: NotificationType.Error,
        message: errors,
        once: true,
      });
      error.handled = true;
    }
  }

  if (isForbidden(status)) {
    errors = 'You are not allowed to perform this action';
    if (notifications.state.length === 0) {
      notify({
        type: NotificationType.Error,
        message: errors,
        once: true,
      });
      error.handled = true;
    }
  }

  if (isInternalServerError(status)) {
    errors = 'A server error occurred during request execution';
    if (notifications.state.length === 0) {
      notify({
        type: NotificationType.Error,
        message: errors,
        once: true,
      });
      error.handled = true;
    }
  }

  error.errors = errors;
  error.status = status;

  if (isUnauthorized(status)) {
    // Logout here if necessary

    return Promise.reject(error);
  }
  return Promise.reject(error);
}

axios.interceptors.response.use(successInterceptor, errorInterceptor);
