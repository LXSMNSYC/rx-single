import AbortController from 'abort-controller';
/**
 * @ignore
 */
// eslint-disable-next-line valid-typeof
const isType = (x, y) => typeof x === y;
/**
 * @ignore
 */
export const isFunction = x => isType(x, 'function');
/**
 * @ignore
 */
export const isNumber = x => isType(x, 'number');
/**
 * @ignore
 */
export const isObject = x => isType(x, 'object');
/**
 * @ignore
 */
export const isIterable = obj => isObject(obj) && isFunction(obj[Symbol.iterator]);
/**
 * @ignore
 */
export const isObserver = obj => isObject(obj) && isFunction(obj.onSubscribe);
/**
 * @ignore
 */
export const toCallable = x => () => x;
/**
 * @ignore
 */
export const isPromise = (obj) => {
  if (obj == null) return false;
  if (obj instanceof Promise) return true;
  return (isObject(obj) || isFunction(obj)) && isFunction(obj.then);
};
/**
 * @ignore
 */
export function onSuccessHandler(value) {
  const { onSuccess, onError, controller } = this;
  if (controller.signal.aborted) {
    return;
  }
  try {
    if (typeof value === 'undefined') {
      onError(new Error('onSuccess called with a null value.'));
    } else {
      onSuccess(value);
    }
  } finally {
    controller.abort();
  }
}
/**
 * @ignore
 */
export function onErrorHandler(err) {
  const { onError, controller } = this;
  let report = err;
  if (!(err instanceof Error)) {
    report = new Error('onError called with a non-Error value.');
  }
  if (controller.signal.aborted) {
    return;
  }

  try {
    onError(report);
  } finally {
    controller.abort();
  }
}
/**
 * @ignore
 */
const identity = x => x;
/**
 * @ignore
 */
const throwError = (x) => { throw x; };
/**
 * @ignore
 */
export const cleanObserver = x => ({
  onSubscribe: x.onSubscribe,
  onSuccess: isFunction(x.onSuccess) ? x.onSuccess : identity,
  onError: isFunction(x.onError) ? x.onError : throwError,
});
/**
 * @ignore
 */
export const immediateSuccess = (o, x) => {
  // const disposable = new SimpleDisposable();
  const { onSubscribe, onSuccess } = cleanObserver(o);
  const controller = new AbortController();
  onSubscribe(controller);

  if (!controller.signal.aborted) {
    onSuccess(x);
    controller.abort();
  }
};
/**
 * @ignore
 */
export const immediateError = (o, x) => {
  const { onSubscribe, onError } = cleanObserver(o);
  const controller = new AbortController();
  onSubscribe(controller);

  if (!controller.signal.aborted) {
    onError(x);
    controller.abort();
  }
};
