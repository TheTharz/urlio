import toast from "react-hot-toast";

export const showSuccess = (message: string) => {
  toast.success(message);
};

export const showError = (message: string) => {
  toast.error(message);
};

export const showLoading = (message: string) => {
  return toast.loading(message);
};

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

// Specific toast messages for common scenarios
export const toastMessages = {
  urlShortened: "URL shortened successfully!",
  copied: "Copied to clipboard!",
  emptyUrl: "Please enter a URL",
  invalidUrl: "Please enter a valid URL",
  shortenFailed: "Failed to shorten URL. Please try again.",
  copyFailed: "Failed to copy to clipboard",
  networkError: "Network error. Please check your connection.",
  serviceUnavailable: "Service temporarily unavailable. Please try again later.",
};
