function myPromise(constructor) {
  let self = this;

  self.status = "pending" //定义状态改变前的初始状态

  self.value = undefined;//定义状态为resolved的时候的状态

  self.reason = undefined;//定义状态为rejected的时候的状态

  self.rejectCallbackFunc = []; // 失败回调

  self.resolveCallbackFunc = []; // 成功回调


  function resolve(value) {

    // TODO resolve如何改变状态及返回结果
    if (self.status === 'pending') {
      self.value = value
      self.status = 'fulfilled'
      self.resolveCallbackFunc.forEach(callback => {
        queueMicrotask(() => {
          callback(value)
        })
      })
    }
  }

  function reject(reason) {

    // TODO reject如何改变状态及返回结果
    if (self.status === 'pending') {
      self.reason = reason
      self.status = 'rejected'
      self.rejectCallbackFunc.forEach(callback => {
        queueMicrotask(() => {
          callback(reason)
        })
      })
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
  onFullfilled = typeof onFullfilled === 'function' ? onFullfilled : v => v;
  onRejected = typeof onRejected === 'function' ? onRejected : r => { throw r }
  //TODO then如何实现
  const promise1 = new myPromise((resolve, reject) => {
    if (this.status === 'fulfilled') {
      queueMicrotask(() => {
        try {
          let x = onFullfilled(this.value);
          resolvePromise(promise1, x, resolve, reject)
        } catch(e) {
          reject(e)
        }
      })
    }
    if (this.status === 'rejected') {
      queueMicrotask(() => {
        try {
          let x = onRejected(this.reason)
          resolvePromise(promise1, x, resolve, reject);
        } catch(e) {
          reject(e)
        }
      })
    }
    if (this.status === 'pending') {
      this.resolveCallbackFunc.push(() => {
        try {
          let x = onFullfilled(this.value);
          resolvePromise(promise1, x, resolve, reject);
        } catch(e) {
          reject(e)
        }
      })
      this.rejectCallbackFunc.push(() => {
        try {
          let x = onRejected(this.reason);
          resolvePromise(promise1, x, resolve, reject)
        } catch(e) {
          reject(e)
        }
      })
    }
  })
  return promise1;
}

// catch 调用 then 方法
myPromise.prototype.catch = function(onRejected) {
  return myPromise.prototype.then.call(myPromise, null, onRejected);
}
 
// 实现链式调用
function resolvePromise(promise2, x, resolve, reject) {
  // 首先是 基础类型 不是函数，不是对象
  if (x === null ) return resolve(x);
  if (typeof x !== 'object' && typeof x !== 'function') return resolve(x);

  if (x === promise2) {
    return reject(new TypeError('Chaining cycle detected for promise'));
  }
  // 如果是promise 
  if (x instanceof myPromise) {
    if (x.status === 'pending') {
      x.then(y => {
        resolvePromise(promise2, y, resolve, reject)
      }, reject)
    } else if(x.status === 'fulfilled') {
      resolve(x.value)
    } else if(x.status === 'rejected') {
      reject(x.reason)
    }
  }

  // 函数或者对象
  if(typeof x === 'object' || typeof x === 'function') {
    try {
      var then = x.then;
    } catch (e) {
        return reject(e);
    }
    if (typeof then === 'function') {
      let called = false;
      try {
        then.call(x, y => {
          if (called) return;
          called = true;
          resolvePromise(promise2, y, resolve, reject);
        }, r => {
          if (called) return;
          called = true;
          reject(r);
        })
      } catch (e) {
        if (called) return;
        called = true;
        reject(e);
      }
    } else {
      resolve(x)
    }
  }
}

myPromise.deferred = function() {
  let result = {};
  result.promise = new myPromise((resolve, reject) => {
    result.resolve = resolve
    result.reject = reject
  })
  return result
}

module.exports = myPromise
