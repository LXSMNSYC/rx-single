import Single from '../../single';
import { cleanObserver } from '../utils';

function subscribeActual(observer) {
  const { onSuccess, onError, onSubscribe } = cleanObserver(observer);

  const { source, item } = this;

  source.subscribeWith({
    onSubscribe,
    onSuccess,
    onError(x) {
      let result;

      try {
        result = item(x);

        if (result == null) {
          throw new Error(new Error('Single.onErrorReturn: returned a null value.'));
        }
      } catch (e) {
        onError([x, e]);
        return;
      }
      onSuccess(result);
    },
  });
}
/**
 * @ignore
 */
export default (source, item) => {
  if (typeof item !== 'function') {
    return source;
  }

  const single = new Single(subscribeActual);
  single.source = source;
  single.item = item;
  return single;
};
