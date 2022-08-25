function myPromise(constructor) {
  let self = this;

  self.status = "pending" //定义状态改变前的初始状态

  self.value = undefined;//定义状态为resolved的时候的状态

  self.reason = undefined;//定义状态为rejected的时候的状态

  function resolve(value) {

    // TODO resolve如何改变状态及返回结果
    if (this.status === "pending") {
      this.status = "fulfilled";
      this.value = value;
    }

  }

  function reject(reason) {

    // TODO reject如何改变状态及返回结果
    if (this.status === "pending") {
      this.status = "rejected";
      this.reason = reason;
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
  setTimeout(() => {
    if (this.status === "fulfilled") {
      onFullfilled(this.value);
    } else if (this.status === "rejected") {
      onRejected(this.reason);
    }
  })

}
module.exports = myPromise