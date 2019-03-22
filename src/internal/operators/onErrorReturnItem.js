import Single from '../../single';

function subscribeActual(observer) {
  const { onSuccess, onSubscribe } = observer;

  const { source, item } = this;

  source.subscribeWith({
    onSubscribe,
    onSuccess,
    onError() {
      onSuccess(item);
    },
  });
}
/**
 * @ignore
 */
const onErrorReturnItem = (source, item) => {
  if (typeof item === 'undefined') {
    return source;
  }

  const single = new Single();
  single.source = source;
  single.item = item;
  single.subscribeActual = subscribeActual.bind(single);
  return single;
};

export default onErrorReturnItem;