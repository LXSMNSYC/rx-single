import { cleanObserver, isFunction } from '../utils';
import Single from '../../single';
import error from './error';
import SingleEmitter from '../../emitter';

/**
 * @ignore
 */
function subscribeActual(observer) {
  const { onSuccess, onError, onSubscribe } = cleanObserver(observer);

  const emitter = new SingleEmitter(onSuccess, onError);

  onSubscribe(emitter);

  try {
    this.subscriber(emitter);
  } catch (ex) {
    emitter.onError(ex);
  }
}
/**
 * @ignore
 */
export default (subscriber) => {
  if (!isFunction(subscriber)) {
    return error(new Error('Single.create: There are no subscribers.'));
  }
  const single = new Single(subscribeActual);
  single.subscriber = subscriber;
  return single;
};
