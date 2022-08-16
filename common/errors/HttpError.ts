type ErrorProps = {
  message: string;
  status: number;
  cause?: Error | undefined;
};

export class HttpError extends Error {
  status: number;

  constructor({ message, status, cause }: ErrorProps) {
    super(`Status Code: ${status} | ${message}`, { cause });
    this.status = status;
    this.name = HttpError.name;
  }
}
