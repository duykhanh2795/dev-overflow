import { RequestError } from "../http-errors";
import logger from "../logger";
import handleError from "./error";
interface Options extends RequestInit {
  timeout?: number;
}

const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

export async function fetchHandler<T>(
  url: string,
  options: Options = {}
): Promise<ActionResponse<T>> {
  const {
    timeout = 5000,
    headers: customHeaders = {},
    ...restOptions
  } = options;

  const controller = new AbortController();
  const id = setTimeout(() => {
    controller.abort();
  }, timeout);

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const headers: HeadersInit = {
    ...defaultHeaders,
    ...customHeaders,
  };
  const fetchOptions: RequestInit = {
    ...restOptions,
    headers,
    signal: controller.signal,
  };
  try {
    const response = await fetch(url, fetchOptions);
    clearTimeout(id);

    if (!response.ok) {
      throw new RequestError(
        response.status,
        `HTTP error! status: ${response.status} ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    const err = isError(error) ? error : new Error("An unknown error occurred");
    if (err.name === "AbortError") {
      logger.warn(`Request to ${url} timed out after ${timeout}ms`);
    } else {
      logger.error(`Error fetching ${url}: ${err.message}`);
    }
    return handleError(err) as ActionResponse<T>;
  }
}
