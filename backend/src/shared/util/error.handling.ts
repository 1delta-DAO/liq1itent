const ERROR = Symbol("ERROR");
type Error = {
  [ERROR]: true;
  error: unknown;
  type?: ErrorType;
};

type ErrorType = "internet" | "fileSystem" | "badInput";

export function isError(x: unknown): x is Error {
  return typeof x === "object" && x != null && ERROR in x;
}

export function Error(message: string, type?: string) {
  return { [ERROR]: true, error: message, type: type };
}

export async function tryFail<T>(
  f: (() => Promise<T>) | (() => T)
): Promise<T | Error> {
  try {
    return await f();
  } catch (e) {
    return { [ERROR]: true, error: e };
  }
}
