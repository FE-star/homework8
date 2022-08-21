function myPromise(constructor) {
  let self = this;

  self.status = "pending" //定义状态改变前的初始状态

  self.value = undefined;//定义状态为resolved的时候的状态

  self.reason = undefined;//定义状态为rejected的时候的状态

  function resolve(value) {
    if (self.status === "pending") {
      self.status = "resolved";
      self.value = value;
    }

  }

  function reject(reason) {

    if (self.status === "pending") {
      self.status = "rejected";
      self.reason = reason;
    }

  }

  try {

    constructor(resolve, reject);

  } catch (e) {

    reject(e);

  }

}

myPromise.prototype.then = function (onFullfilled, onRejected) {

  // 实现then方法
  let self = this;
  if (self.status === "resolved") {
    onFullfilled(self.value);
  }
  if (self.status === "rejected") {
    onRejected(self.reason);
  }

}
module.exports = myPromise
