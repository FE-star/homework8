function myPromise(constructor) {
  let self = this;

  self.status = "pending" //定义状态改变前的初始状态

  self.value = undefined;//定义状态为resolved的时候的状态

  self.reason = undefined;//定义状态为rejected的时候的状态

  function resolve(value) {
    self.status = 'resolve';
    self.value = value;

  }

  function reject(reason) {
    self.status = 'reject';
    self.reason = reason;
  }

  //捕获构造异常

  try {

    constructor(resolve, reject);

  } catch (e) {

    reject(e);

  }

}

myPromise.prototype.then = function (onFullfilled, onRejected) {
  if (this.status === 'resolve') {
    onFullfilled(this.value);
  } else if (this.status === 'reject') {
    onRejected(this.reason);
  }

}
module.exports = myPromise
