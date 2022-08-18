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
    self._onFullfilledList.forEach(fn => fn(self.value));
  }

  function reject(reason) {
    if (self.status !== 'pending') {
      return;
    }
    self.status = 'rejected';
    self.reason = reason;
    self._onRejectedList.forEach(fn => fn(self.reason));
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
  let self = this;

  return new myPromise((_resolve, _reject) => {

    const _handleFullfiled = isFunction(onFullfilled) && ((_value) => {
      try {
        const nextValue = onFullfilled(_value);
        _resolve(nextValue);
      } catch (error) {
        _reject(error);
      }
    });

    const _handleRejected = isFunction(onRejected) && ((_reason) => {
      try {
        const newValue = onRejected(_reason);
        _resolve(newValue);
      } catch (error) {
        _reject(error);
      }
    })

    // 非 pending 状态直接回调
    if (self.status === 'fullfilled') {
      _handleFullfiled && _handleFullfiled(self.value);
      return;
    }
    if (self.status === 'rejected') {
      _handleRejected && _handleRejected(self.reason);
      return;
    }

    // pending 状态则加入待回调队列
    _handleFullfiled && self._onFullfilledList.push(_handleFullfiled)
    _handleRejected && self._onRejectedList.push(_handleRejected)
  });

}
module.exports = myPromise
