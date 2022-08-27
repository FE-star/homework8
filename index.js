const Status = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected'
}

function myPromise(constructor) {
  let self = this;

  self.status = Status.PENDING //定义状态改变前的初始状态

  self.value = undefined;//定义状态为resolved的时候的状态

  self.reason = undefined;//定义状态为rejected的时候的状态

  function resolve(value) {
    if (self.status === Status.PENDING) {
      self.status = Status.FULFILLED
      self.value = value
    }

  }

  function reject(reason) {
    if (self.status === Status.PENDING) {
      self.status = Status.REJECTED
      self.reason = reason
    }

  }

  //捕获构造异常

  try {

    constructor(resolve, reject);

  } catch (e) {

    reject(e);

  }

}

myPromise.prototype.then = function (onFullfilled, onRejected) {
  if (this.status === Status.FULFILLED) {
    onFullfilled?.(this.value)
  } else if (this.status === Status.REJECTED) {
    onRejected?.(this.reason)
  }


}
module.exports = myPromise
