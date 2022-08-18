function myPromise(constructor) {
  let self = this;

  self.status = "pending" //定义状态改变前的初始状态

  self.value = undefined;//定义状态为fullfilled的时候的状态

  self.reason = undefined;//定义状态为rejected的时候的状态

  this._onFullfilledList = []; // fullfilled 时回调队列

  this._onRejectedList = []; // rejected 时回调队列

  function resolve(value) {
    if (self.status !== 'pending') {
      // 非 pending，Promise 的状态和值都不能再变
      return;
    }
    self.status = 'fullfilled'; // 修改状态
    self.value = value; // 存储值
    this._onFullfilledList.forEach(fn => fn(self.value))
  }

  function reject(reason) {
    if (self.status !== 'pending') {
      return;
    }
    self.status = 'rejected';
    self.reason = reason;
    this._onFullfilledList.forEach(fn => fn(self.reason))
  }

  //捕获构造异常

  try {
    constructor(resolve, reject);
  } catch (e) {
    reject(e);
  }

}

function isFunction(fn) {
  return (typeof fn) === 'function';
}

myPromise.prototype.then = function (onFullfilled, onRejected) {
  // 非 pending 状态直接回调
  if (this.status === 'fullfilled') {
    isFunction(onFullfilled) && onFullfilled(this.value);
    return;
  }
  if (this.status === 'rejected') {
    isFunction(onRejected) && onRejected(this.reason);
    return;
  }

  // pending 状态则加入待回调队列
  isFunction(onFullfilled) && this._onFullfilledList.push(onFullfilled);
  isFunction(onRejected) && this._onRejectedList.push(onRejected);
}
module.exports = myPromise
