import Single from '../../single';
import { immediateError, cleanObserver, exists } from '../utils';
import is from '../is';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onSuccess, onError, onSubscribe } = cleanObserver(observer);

  let result;

  let err;
  try {
    result = this.supplier();
    if (!is(result)) {
      throw new Error('Single.defer: supplier returned a non-Single.');
    }
  } catch (e) {
    err = e;
  }

  if (exists(err)) {
    immediateError(observer, err);
  } else {
    result.subscribeWith({
      onSubscribe,
      onSuccess,
      onError,
    });
  }
}
/**
 * @ignore
 */
export default (supplier) => {
  const single = new Single(subscribeActual);
  single.supplier = supplier;
  return single;
};
