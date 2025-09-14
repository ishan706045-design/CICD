export function buildErrorResponse(message: string, error: string, status = 401) {
  return {
    success: false,
    message,
    error,
    timestamp: Math.floor(Date.now() / 1000),
  };
}