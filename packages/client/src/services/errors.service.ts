import * as notify from "./notification.service";

/**
 * This is a global error handler for those errors which are coming from backend
 * @param error
 * @param handlers
 */
export const handleGlobalErrors = (
  error: { response: { handled: boolean; status: any; data: { error: { message: string } } }; message: string; },
  handlers: { authenticationErrorHandler: () => void }
) => {
  if (!error || !error.response) {
    notify.error("Something went wrong");
  }
  error.response.handled = true;
  switch (error.response.status) {
    case 401:
      notify.error((error.response.data && error.response.data.error) ? error.response.data.error.message : "Session expired. Please login again.");
      if (typeof handlers.authenticationErrorHandler === "function") {
        handlers.authenticationErrorHandler();
      }
      break;
    case 500:
      notify.error((error.response.data && error.response.data.error) ? error.response.data.error.message : error.message);
      break;
    case 404:
      notify.error(error.message);
      break;
    default:
      error.response.handled = false;
  }
  return error;
};
