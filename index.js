const PROMISE_STATUS_ENUM = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected"
}

function myPromise(constructor) {
  let self = this;

  self.status = "pending" //定义状态改变前的初始状态

  self.value = undefined;//定义状态为resolved的时候的状态

  self.reason = undefined;//定义状态为rejected的时候的状态

  function resolve(value) {
    // TODO resolve如何改变状态及返回结果
    if(self.status === PROMISE_STATUS_ENUM.PENDING) {
      self.status = PROMISE_STATUS_ENUM.FULFILLED
      self.value = value
    }
  }

  function reject(reason) {

    // TODO reject如何改变状态及返回结果
    if(self.status === PROMISE_STATUS_ENUM.PENDING) {
      self.status = PROMISE_STATUS_ENUM.REJECTED
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

  //TODO then如何实现
  if(this.status === PROMISE_STATUS_ENUM.FULFILLED) {
    onFullfilled(this.value)
  } else if (this.status === PROMISE_STATUS_ENUM.REJECTED) {
    onRejected(this.reason)
  }

}
module.exports = myPromise
