export const normalizeRequestError = (error: unknown): Error => {
  if (!(error instanceof Error)) {
    return new Error(String(error));
  }

  if (error.message === 'null') {
    return new Error('The page you are trying to reach is inaccessible. The page may be unavailable for unregistered users or may have been disabled or deleted.', {
      cause: error,
    });
  }

  if (error instanceof TypeError) {
    return new Error('The page cannot be parsed. The page may not exist.', {
      cause: error,
    });
  }

  return error;
}
