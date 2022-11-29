export const getErrorMessage = (error: unknown): string | undefined => {
  if (typeof error === 'object' && error) {
    return (error as any).message;
  }

  if (typeof error === 'string') {
    return error;
  }
}
