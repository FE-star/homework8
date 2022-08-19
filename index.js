function myPromise(constructor) {
  let self = this;

  self.status = "pending" //定义状态改变前的初始状态 pending resolved rejected

  self.value = undefined;//定义状态为resolved的时候的状态

  self.reason = undefined;//定义状态为rejected的时候的状态

  self.resolveFnArr = [];
  self.rejectFnArr = [];

  function changeStatus(status, value) {
    if (self.status !== 'pending') {
      return;
    }
    self.status = status;
    self.value = value;
    let fnArr = self.status === 'resolved' ? self.resolveFnArr : self.rejectFnArr;
    if (fnArr.length > 0) {
      fnArr.forEach(item => {
        item(value);
      });
    }
  }

  function resolve(value) {
    if (self.resolveFnArr.length > 0) {
      changeStatus('resolved', value);
    }
    let timer = setTimeout(() => {
      changeStatus('resolved', value);
      clearTimeout(timer);
    }, 0)
  }

  function reject(reason) {
    if (self.rejectFnArr.length > 0) {
      changeStatus('rejected', reason);
    }
    let timer = setTimeout(() => {
      changeStatus('rejected', reason);
      clearTimeout(timer);
    }, 0);
  }

  //捕获构造异常

  try {

    constructor(resolve, reject);

  } catch (e) {

    reject(e);

  }

}

myPromise.prototype.then = function (onFullfilled, onRejected) {
  if (typeof onFullfilled !== 'function') {
    onFullfilled = (res) => {
      return res;
    }
  }
  if (typeof onRejected !== 'function') {
    onRejected = (reason) => {
      return new myPromise((_, reject) => {
        reject(reason);
      })
    }
  }
  return new myPromise((resolve, reject) => {
    this.resolveFnArr.push((res) => {
      try {
        let excuteRes = onFullfilled(res);
        if (excuteRes instanceof myPromise) {
          excuteRes.then(resolve, reject);
        } else {
          resolve(excuteRes);
        }
      } catch (error) {
        reject(error);
      }
    });
    this.rejectFnArr.push((reason) => {
      try {
        let excuteRes = onRejected(reason);
        if (excuteRes instanceof myPromise) {
          excuteRes.then(resolve, reject);
        } else {
          resolve(excuteRes);
        }
      } catch (error) {
        reject(error);
      }
    });
  })
}

myPromise.prototype.catch = function (rejectFn) {
  return this.then(null, rejectFn);
}


module.exports = myPromise;
