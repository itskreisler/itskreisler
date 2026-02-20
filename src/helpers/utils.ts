// Sobrecarga para funciones asíncronas
function tryCatch<T extends (..._args: any[]) => Promise<any>>(
  _fn: T,
  ..._args: Parameters<T>
): Promise<[Error | null, Awaited<ReturnType<T>> | undefined]>;

// Sobrecarga para funciones síncronas
function tryCatch<T extends (..._args: any[]) => any>(
  _fn: T,
  ..._args: Parameters<T>
): [Error | null, ReturnType<T> | undefined];

// Implementación común
function tryCatch<T extends (..._args: any[]) => any>(
  _fn: T,
  ..._args: Parameters<T>
): [Error | null, ReturnType<T> | undefined] | Promise<[Error | null, Awaited<ReturnType<T>> | undefined]> {
  try {
    const result = _fn(..._args)

    if (result instanceof Promise) {
      return result
        .then((data) => [null, data] as [null, Awaited<ReturnType<T>>])
        .catch((error) => [error, undefined] as [Error, undefined])
    }

    return [null, result] as [null, ReturnType<T>]
  } catch (error) {
    return [error instanceof Error ? error : new Error(String(error)), undefined] as [Error, undefined]
  }
}
