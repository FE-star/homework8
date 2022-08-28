function myPromise(executor) {
  // 定义promise的状态
  let self = this;
  self.status = "pendding";
  self.value = null; // 成功之后 返回数据
  self.reason = null;  // 失败之后返回原因

  // 这个是 发布订阅
  self.fulfilledCallbackList = [];
  self.rejectCallbackList = [];

  // 定义完成时的方法
  function resolve(value) {
      if (self.status == "pendding") {
          self.status = "fulfilled";
          self.value = value;
          self.fulfilledCallbackList.forEach(item => item(value));
      }
  }
  // 这个是 异常时候的方法
  function reject(err) {
      if (self.status == "pendding") {
          self.status = "rejected";
          self.reason = err;
          self.rejectCallbackList.forEach(item => item(err));
      }
  }

  // 立即执行 executor里面的方法
  try {
     executor(resolve, reject);
  } catch (err) {
      reject(err.message);
  }
}

// 这个是 原型链上面的 then 方法
myPromise.prototype.then = function (onFulfilled, onRejected) {
  // 这里 还要 判断一下 传入进来 是不是一个方法
  onFulfilled = typeof onFulfilled == 'function' ? onFulfilled : function (data) { resolve(data) };
  onRejected = typeof onRejected == 'function' ? onRejected : function (err) { throw err; }

  let self = this;

  // 这里是 then 里面的回调部分
  if (self.status == "fulfilled") {
      // 链式调用 就是 直接返回一个 Promise
      return new myPromise((resolve, reject) => {
          try {
              let x = onFulfilled(self.value);
              x instanceof myPromise ? x.then(resolve, reject) : resolve(x);
          } catch (err) {
              reject(err);
          }

      });
  }

  // 这个是 失败的状态
  if (self.status == "rejected") {
      return new myPromise((resolve, reject) => {
          try {
              let x = onRejected(self.reason);
              x instanceof myPromise ? x.then(resolve, reject) : resolve(x);
          } catch (err) {
              reject(err);
          }
      });
  }

  // 这个是 pendding的状态
  if (self.status == "pendding") {
      return new myPromise((resolve, reject) => {
          self.fulfilledCallbackList.push(() => {
              let x = onFulfilled(self.value);
              x instanceof myPromise ? x.then(resolve, reject) : resolve(x);
          });
          self.rejectCallbackList.push(() => {
              let x = onRejected(self.reason);
              x instanceof myPromise ? x.then(resolve, reject) : resolve(x);
          });
      });
  }
}

module.exports = myPromise
