/* eslint-disable no-undef */
import assert from 'assert';
import Single from '../src/single';

/**
 *
 */
describe('#ambWith', () => {
  /**
   *
   */
  it('should create a Single', () => {
    const single = Single.just('First').ambWith(Single.just('Second'));
    assert(single instanceof Single);
  });
  /**
   *
   */
  it('should return the same instance if the other value is non-Single', () => {
    const source = Single.just('Hello');
    const single = source.ambWith();
    assert(source === single);
  });
  /**
   *
   */
  it('should signal success from the source (if earlier)', (done) => {
    const single = Single.just('Hello').ambWith(Single.timer(100));
    single.subscribe(
      () => done(),
      done,
    );
  });
  /**
   *
   */
  it('should signal success from the other (if earlier).', (done) => {
    const single = Single.timer(100).ambWith(Single.just('Hello'));
    single.subscribe(
      () => done(),
      done,
    );
  });
  /**
   *
   */
  it('should signal error from the source (if earlier).', (done) => {
    const single = Single.error(new Error('Hello')).ambWith(Single.timer(100));
    single.subscribe(
      done,
      e => (e instanceof Error ? done() : done(false)),
    );
  });
  /**
   *
   */
  it('should signal error from the other (if earlier).', (done) => {
    const single = Single.timer(100).ambWith(Single.error(new Error('Hello')));
    single.subscribe(
      done,
      e => (e instanceof Error ? done() : done(false)),
    );
  });
});
