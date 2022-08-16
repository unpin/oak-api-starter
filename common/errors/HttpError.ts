export class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(`Status Code: ${status} | ${message}`);
    this.status = status;
    this.name = HttpError.name;
  }
}
