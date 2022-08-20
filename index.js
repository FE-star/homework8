function myPromise(constructor) {
  let self = this;

  self.status = "pending" //定义状态改变前的初始状态

  self.value = undefined;//定义状态为resolved的时候的状态

  self.reason = undefined;//定义状态为rejected的时候的状态

  self.callbacks = []; // 存储then中传入的参数

  function resolve(value) {

    // TODO resolve如何改变状态及返回结果
    self.status = "resolved";
    self.value = value;

    self.callbacks.forEach(cb=>self._handler(cb))
    return this;

  }

  function reject(reason) {

    // TODO reject如何改变状态及返回结果
    self.status = "rejected";
    self.reason = reason;

    self.callbacks.forEach(cb=>self._handler(cb))
    return this;

  }

  self._handler  = function(cb) {
    const {onFullfilled, onRejected, nextResolve, nextReject} = cb
    if(self.status === "pending") {
      this.callbacks.push(cb);
      return;
    }
    try {
      if(self.status === "resolved") {
        self.value = onFullfilled(self.value)
      } else if (self.status === "rejected") {
        self.value = onRejected(self.reason);
      }
      nextResolve(self.value)
    } catch(err) {
      nextReject(err)
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

  return new myPromise((nextResolve, nextReject) => {
    this._handler({
      onFullfilled,
      onRejected,
      nextResolve,
      nextReject
    })
  })
}

module.exports = myPromise
