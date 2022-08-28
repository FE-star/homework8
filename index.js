function myPromise(constructor) {
  let self = this;

  self.status = "pending" //定义状态改变前的初始状态

  self.value = undefined;//定义状态为resolved的时候的状态

  self.reason = undefined;//定义状态为rejected的时候的状态

  self.resolveCallback = undefined; // resolve回调
  self.rejectCallback = undefined; // reject回调
  function resolve(value) {
    if(self.status === "pending"){
      self.status = "fulfilled";
      self.value = value
    }
    // TODO resolve如何改变状态及返回结果

  }

  function reject(reason) {

    // TODO reject如何改变状态及返回结果
    if(self.status === "pending"){
      self.status = "rejected";
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
  if(this.status === "fulfilled"){
    return onFullfilled(this.value)
  }else if(this.status = "rejected"){
    return onRejected(this.reason)
  }else {
    
    // setTimeout
  }
}
module.exports = myPromise
