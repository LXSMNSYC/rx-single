import Single from '../../single';
import { cleanObserver, isFunction } from '../utils';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onSuccess, onError, onSubscribe } = cleanObserver(observer);

  const { source, callable } = this;

  source.subscribeWith({
    onSubscribe,
    onSuccess(x) {
      onSuccess(x);
      callable();
    },
    onError(x) {
      onError(x);
      callable();
    },
  });
}

/**
 * @ignore
 */
export default (source, callable) => {
  if (!isFunction(callable)) {
    return source;
  }

  const single = new Single(subscribeActual);
  single.source = source;
  single.callable = callable;
  return single;
};
