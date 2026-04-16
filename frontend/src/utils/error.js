export const formatError = (errorResponse) => {
  const detail = errorResponse?.data?.detail;
  
  if (typeof detail === 'string') {
    return detail;
  }
  
  if (Array.isArray(detail)) {
    return detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join(', ');
  }
  
  return errorResponse?.data?.message || 'An unexpected error occurred.';
};
