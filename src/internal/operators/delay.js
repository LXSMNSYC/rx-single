import AbortController from 'abort-controller';
import Single from '../../single';
import { cleanObserver } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onSuccess, onError, onSubscribe } = cleanObserver(observer);

  const { amount, doDelayError } = this;

  let timeout;

  const controller = new AbortController();

  const { signal } = controller;

  onSubscribe(controller);

  if (signal.aborted) {
    return;
  }

  signal.addEventListener('abort', () => {
    if (typeof timeout !== 'undefined') {
      clearTimeout(timeout);
    }
  });

  this.source.subscribeWith({
    onSubscribe(ac) {
      signal.addEventListener('abort', () => {
        ac.abort();
      });
    },
    onSuccess(x) {
      timeout = setTimeout(() => {
        onSuccess(x);
        controller.abort();
      }, amount);
    },
    onError(x) {
      timeout = setTimeout(() => {
        onError(x);
        controller.abort();
      }, doDelayError ? amount : 0);
    },
  });
}
/**
 * @ignore
 */
export default (source, amount, doDelayError) => {
  if (typeof amount !== 'number') {
    return source;
  }
  const single = new Single(subscribeActual);
  single.source = source;
  single.amount = amount;
  single.doDelayError = doDelayError;
  return single;
};
