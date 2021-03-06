import { LinkedCancellable } from 'rx-cancellable';
import Single from '../../single';
import { cleanObserver, defaultScheduler } from '../utils';

function subscribeActual(observer) {
  const { onSubscribe, onSuccess, onError } = cleanObserver(observer);

  const { source, scheduler } = this;

  const controller = new LinkedCancellable();

  onSubscribe(controller);

  controller.link(scheduler.schedule(() => {
    controller.unlink();
    source.subscribeWith({
      onSubscribe(ac) {
        controller.link(ac);
      },
      onSuccess,
      onError,
    });
  }));
}
/**
 * @ignore
 */
export default (source, scheduler) => {
  const single = new Single(subscribeActual);
  single.source = source;
  single.scheduler = defaultScheduler(scheduler);
  return single;
};
