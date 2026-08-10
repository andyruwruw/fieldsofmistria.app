/**
 * Minimal typed fetch wrapper: the single place components' data flows
 * through (via `api/<domain>.ts` modules; components never call this
 * directly). JSON get/post/patch/put/del for a future REST surface, plus
 * `postForm` for the save-file multipart upload.
 */

/**
 * Base URL prepended to every request. Configurable so the unpack server
 * doesn't have to run on localhost:3000: set VITE_API_BASE_URL for other
 * environments.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

/**
 * Error thrown for non-2xx responses, carrying the status and parsed body.
 */
export class HttpError extends Error {
  /**
   * HTTP status code.
   */
  readonly status: number;

  /**
   * Parsed response body, if any.
   */
  readonly body: unknown;

  /**
   * Creates an HttpError.
   *
   * @param {number} status - HTTP status code.
   * @param {unknown} body - Parsed response body.
   */
  constructor(status: number, body: unknown) {
    const message = typeof body === 'object' && body !== null && 'error' in body
      ? String((body as { error: unknown }).error)
      : `Request failed with status ${status}`;
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.body = body;
  }
}

/**
 * Parses a response body as JSON, tolerating an empty body.
 *
 * @param {Response} response - The fetch response.
 * @returns {Promise<unknown>} The parsed body, or null if empty.
 */
const parseBody = async (response: Response): Promise<unknown> => (
  response.status === 204
    ? null
    : await response.json().catch((): null => null)
);

/**
 * Performs a JSON request and parses the JSON response, throwing on non-2xx.
 *
 * @template T - The expected response type.
 * @param {string} method - HTTP method.
 * @param {string} path - Path under {@link API_BASE_URL}.
 * @param {unknown} [body] - Optional JSON body.
 * @returns {Promise<T>} The parsed response.
 * @throws {HttpError} On non-2xx responses.
 */
const request = async <T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> => {
  const headers: Record<string, string> = {};
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      method,
      headers,
      ...(body !== undefined && { body: JSON.stringify(body) }),
    },
  );

  const parsed = await parseBody(response);

  if (!response.ok) {
    throw new HttpError(response.status, parsed);
  }

  return parsed as T;
};

/**
 * GET request.
 *
 * @template T - The expected response type.
 * @param {string} path - Path under the API base.
 * @returns {Promise<T>} The parsed response.
 */
export const get = <T>(path: string): Promise<T> => request<T>('GET', path);

/**
 * POST request with a JSON body.
 *
 * @template T - The expected response type.
 * @param {string} path - Path under the API base.
 * @param {unknown} [body] - JSON body.
 * @returns {Promise<T>} The parsed response.
 */
export const post = <T>(path: string, body?: unknown): Promise<T> => request<T>('POST', path, body);

/**
 * PATCH request.
 *
 * @template T - The expected response type.
 * @param {string} path - Path under the API base.
 * @param {unknown} [body] - JSON body.
 * @returns {Promise<T>} The parsed response.
 */
export const patch = <T>(path: string, body?: unknown): Promise<T> => request<T>('PATCH', path, body);

/**
 * PUT request.
 *
 * @template T - The expected response type.
 * @param {string} path - Path under the API base.
 * @param {unknown} [body] - JSON body.
 * @returns {Promise<T>} The parsed response.
 */
export const put = <T>(path: string, body?: unknown): Promise<T> => request<T>('PUT', path, body);

/**
 * DELETE request.
 *
 * @template T - The expected response type.
 * @param {string} path - Path under the API base.
 * @returns {Promise<T>} The parsed response.
 */
export const del = <T>(path: string): Promise<T> => request<T>('DELETE', path);

/**
 * POST request with a multipart form body (file uploads).
 *
 * @template T - The expected response type.
 * @param {string} path - Path under the API base.
 * @param {FormData} form - The form data to upload.
 * @returns {Promise<T>} The parsed response.
 * @throws {HttpError} On non-2xx responses.
 */
export const postForm = async <T>(path: string, form: FormData): Promise<T> => {
  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      method: 'POST',
      body: form,
    },
  );

  const parsed = await parseBody(response);

  if (!response.ok) {
    throw new HttpError(response.status, parsed);
  }

  return parsed as T;
};
