const PENDING = 'pending'
const FULL_FILLED = 'fulfilled'
const REJECTED = 'rejected'

function myPromise(constructor) {
  let self = this

  self.status = PENDING //定义状态改变前的初始状态

  self.value = undefined //定义状态为resolved的时候的状态

  self.reason = undefined //定义状态为rejected的时候的状态

  self.onResolvedCallbacks = [] // 成功回调

  self.onRejectedCallbacks = [] // 失败回调

  function resolve(value) {
    // TODO resolve如何改变状态及返回结果
    if (self.status === PENDING) {
      self.status = FULL_FILLED
      self.value = value
      self.onResolvedCallbacks.forEach(callback => callback(self.value))
    }
  }

  function reject(reason) {
    // TODO reject如何改变状态及返回结果
    if (self.status === PENDING) {
      self.status = REJECTED
      self.reason = reason
      self.onRejectedCallbacks.forEach(callback => callback(self.reason))
    }
  }

  //捕获构造异常

  try {
    constructor(resolve, reject)
  } catch (e) {
    reject(e)
  }
}

myPromise.prototype.then = function (onFullfilled, onRejected) {
  //TODO then如何实现
  if (this.status === FULL_FILLED) {
    onFullfilled(this.value)
  }

  if (this.status === REJECTED) {
    onRejected(this.reason)
  }

  if (this.status === PENDING) {
    this.onResolvedCallbacks.push(onFullfilled)
    this.onRejectedCallbacks.push(onRejected)
  }
}

module.exports = myPromise
