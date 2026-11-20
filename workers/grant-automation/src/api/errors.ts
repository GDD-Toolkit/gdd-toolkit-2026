/** An error the API returns as `{ error: { status, message } }` with its HTTP status. */
export class ApiError extends Error {
  constructor(
    readonly status: 400 | 401 | 403 | 404 | 429 | 502,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
