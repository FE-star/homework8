function myPromise(constructor) {
  let self = this;

  self.status = "pending" //定义状态改变前的初始状态

  self.value = undefined;//定义状态为resolved的时候的状态

  self.reason = undefined;//定义状态为rejected的时候的状态

  self.onResolvedCallbacks = []; // 成功调用函数数组
  self.onRejectedCallbacks = []; // 失败调用函数数组

  function resolve(value) {

    // TODO resolve如何改变状态及返回结果
    if (self.status === 'pending') {
      self.status = 'fulfilled';
      self.value = value;
      self.onResolvedCallbacks.forEach(fn => fn());
    }

  }

  function reject(reason) {

    // TODO reject如何改变状态及返回结果
    if (self.status === 'pending') {
      self.status = 'rejected';
      self.reason = reason;
      self.onRejectedCallbacks.forEach(fn => fn());
    }
  }

  //捕获构造异常

  try {

    constructor(resolve, reject);

  } catch (e) {

    reject(e);

  }

}

// A+规范规定，让不同的promise代码互相套用
function resolvePromise(promise2, x, resolve, reject) {
  // 循环引用报错
  if (x === promise2) {
    return reject(new TypeError('promise循环引用'))
  }
  // 防止多次调用
  let called;
  // x不是null且x是对象或者函数
  if (x != null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      // A+规范规定，声明then = x的then方法
      let then = x.then;
      // 如果then是函数，默认是promise了
      if (typeof then === 'function') {
        // 就让then执行 第一个参数是this, 后面是成功的回调和失败的回调
        then.call(x, y => {
          if (called) return;
          called = true;
          // resolve的结果依旧是promise那就继续解析
          resolvePromise(promice2, y, resolve, reject);
        }, err => {
          if (called) return;
          called = true;
          reject(err);
        })
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}

myPromise.prototype.then = function (onFullfilled, onRejected) {

  //TODO then如何实现
  // onFulfilled如果不是函数，就忽略onFulfilled，直接返回value
  onFullfilled = typeof onFullfilled === 'function' ? onFullfilled : value => value;
  // onRejected如果不是函数，就忽略onRejected，直接扔出错误
  onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
  let promise2 = new Promise((resolve, reject) => {
    if (this.status === 'fulfilled') {
      // 异步
      setTimeout(() => {
        try {
          let x = onFullfilled(this.value);
          resolvePromise(promise2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      }, 0);
    }
    if (this.status === 'rejected') {
      // 异步
      setTimeout(() => {
        try {
          let x = onRejected(this.reason);
          resolvePromise(promise2, x, resolve, reject);
        } catch(e) {
          reject(e);
        }
      });
    }
    if (this.status === 'pending') {
      this.onResolvedCallbacks.push(() => {
        // 异步
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      });
      this.onRejectedCallbacks.push(() => {
        // 异步
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0)
      });
    };
  });

  return promise2;
}
module.exports = myPromise
