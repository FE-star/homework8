const queueMicrotask = require('queue-microtask')
function myPromise(constructor) {
  let self = this;

  self.status = "pending" //定义状态改变前的初始状态

  self.value = undefined; //定义状态为 resolved 的时候的状态

  self.reason = undefined; //定义状态为 rejected 的时候的状态

  function resolve(value) {

    // TODO resolve如何改变状态及返回结果
    self.status = 'resolved'
    self.value = value

  }

  function reject(reason) {

    // TODO reject如何改变状态及返回结果
    self.status = 'rejected'
    self.reason = reason

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
  that = this
  // queueMicrotask 建立微任务
  queueMicrotask(function() {
    if(that.status === 'resolved') {
      onFullfilled(that.value)
    }
    if(that.status === 'rejected') {
      onRejected(that.reason)
    }
  })
}
module.exports = myPromise
