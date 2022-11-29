export class Exception extends Error {
  code: string | undefined;
  status: number | undefined;

  constructor(message: string, options?: ExceptionOptions | undefined) {
    super(message, options?.cause ? { cause: options.cause } : {});

    /**
     * Set status as a public property (only when defined)
     */
    if (options?.status) {
      Object.defineProperty(this, 'status', {
        configurable: true,
        enumerable: false,
        value: options.status,
        writable: true,
      });
    }

    /**
     * Set error code as a public property (only when defined)
     */
    if (options?.code) {
      Object.defineProperty(this, 'code', {
        configurable: true,
        enumerable: false,
        value: options.code,
        writable: true,
      });
    }

    /**
     * Update the stack trace
     */
    Error.captureStackTrace(this, this.constructor);
  }

  static is(value: unknown): value is Exception;
  static is(value: unknown, options: { code: string }): value is (Exception & { code: string });
  static is(value: unknown, options?: { code: string } | undefined): value is (Exception & { code: string }) {
    if (!(value instanceof Exception)) {
      return false;
    }

    if (!options?.code) {
      return true;
    }

    return value.code === options.code;
  }
}

export interface ExceptionOptions {
  status?: number | undefined;
  code?: string | undefined;
  cause?: Error | undefined;
}
