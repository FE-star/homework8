const STATUS_PENDING = 'pending';
const STATUS_FULFILLED = 'fulfilled';
const STATUS_REJECTED = 'rejected';

function MyPromise(constructor) {
  let self = this;

  self.status = "pending" //定义状态改变前的初始状态

  self.value = undefined; //定义状态为resolved的时候的状态

  self.reason = undefined; //定义状态为rejected的时候的状态

  self.resolveCallbacks = [];
  self.rejectCallbacks = [];

  function resolve(value) {
    if (self.status === STATUS_PENDING) {
      self.status = 'fulfilled';
      self.value = value;
      self.resolveCallbacks.forEach(fn => fn(self.value));
    }
  }

  function reject(reason) {
    if (self.status === STATUS_PENDING) {
      self.status = 'rejected';
      self.reason = reason;
      self.rejectCallbacks.forEach(fn => fn(self.reason));
    }
  }

  //捕获构造异常

  try {

    constructor(resolve, reject);

  } catch (e) {

    reject(e);

  }

}

MyPromise.prototype.then = function (onFullfilled, onRejected) {
  onFullfilled = typeof onFullfilled === 'function' ? onFullfilled : (v) => v;
  onRejected = typeof onRejected === 'function' ? onRejected : (e) => e;

  if (this.status === 'pending') {
    const p = new MyPromise((resolve, reject) => {
      this.resolveCallbacks.push(() => {
        try {
          const newValue = onFullfilled(this.value);
          resolve(newValue);
        } catch (e) {
          reject(e)
        }
      });

      this.rejectCallbacks.push(() => {
        try {
          const newReason = onRejected(this.reason)
          reject(newReason)
        } catch (e) {
          reject(e)
        }
      });
    });
    return p;
  }

  if (this.status === STATUS_FULFILLED) {
    const p = new MyPromise((resolve, reject) => {
      try {
        const newValue = onFullfilled(this.value);
        resolve(newValue);
      } catch (e) {
        reject(e);
      }
    });
    return p;
  }

  if (this.status === STATUS_REJECTED) {
    const p = new MyPromise((resolve, reject) => {
      try {
        const newReason = onRejected(this.reason);
        reject(newReason);
      } catch (e) {
        reject(e);
      }
    });
    return p;
  }
}

module.exports = MyPromise;
