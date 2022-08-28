const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'
function MyPromise(constructor) {
  this.status = PENDING //定义状态改变前的初始状态

  this.value = undefined;//定义状态为resolved的时候的状态

  this.reason = undefined;//定义状态为rejected的时候的状态
  this.fulfilledQueues = []
  this.rejectedQueues = []
  const resolve = (value) => {
    const run = () => {
      if (this.status !== PENDING) return
      this.status = FULFILLED
      // 依次执行成功队列中的函数，并清空队列
      const runFulfilled = (value) => {
        let cb;
        while (cb = this.fulfilledQueues.shift()) {
          cb(value)
        }
      }
      // 依次执行失败队列中的函数，并清空队列
      const runRejected = (error) => {
        let cb;
        while (cb = this.rejectedQueues.shift()) {
          cb(error)
        }
      }
      /* 如果resolve的参数为Promise对象，则必须等待该Promise对象状态改变后,
        当前Promsie的状态才会改变，且状态取决于参数Promsie对象的状态
      */
      if (value instanceof MyPromise) {
        value.then(value => {
          this.value = value
          runFulfilled(value)
        }, err => {
          this.value = err
          runRejected(err)
        })
      } else {
        this.value = value
        runFulfilled(value)
      }
    }
    // 为了支持同步的Promise，这里采用异步调用
    setTimeout(run, 0)
  }
  const reject = (reason) => {
    if(this.status !== PENDING) return
    // 依次执行失败队列中的函数，并清空队列
    const run = () => {
      this.status = REJECTED
      this.reason = reason
      let cb;
      while (cb = this.rejectedQueues.shift()) {
        cb(reason)
      }
    }
    // 为了支持同步的Promise，这里采用异步调用
    setTimeout(run, 0)
  }

  //捕获构造异常
  try {
    constructor(resolve, reject);
  } catch (e) {
    reject(e);
  }

}

MyPromise.prototype.then = function (onFulfilled, onRejected) {

  const { value, status, reason } = this
  // 返回一个新的Promise对象
  return new MyPromise((onFulfilledNext, onRejectedNext) => {
    // 封装一个成功时执行的函数
    let fulfilled = value => {
      try {
        // 如果不是函数需要包装下
        if (typeof onFulfilled !== 'function') {
         onFulfilledNext(value)
        } else {
          let res =  onFulfilled(value);
          if (res instanceof MyPromise) {
            // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
            res.then(onFulfilledNext, onRejectedNext)
          } else {
            //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
            onFulfilledNext(res)
          }
        }
      } catch (err) {
        // 如果函数执行出错，新的Promise对象的状态为失败
        onRejectedNext(err)
      }
    }
    // 封装一个失败时执行的函数
    let rejected = error => {
      try {
        if (typeof onRejected !== 'function') {
          onRejectedNext(error)
        } else {
            let res = onRejected(error);
            if (res instanceof MyPromise) {
              // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
              res.then(onFulfilledNext, onRejectedNext)
            } else {
              //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
              onFulfilledNext(res)
            }
        }
      } catch (err) {
        // 如果函数执行出错，新的Promise对象的状态为失败
        onRejectedNext(err)
      }
    }
    switch (status) {
      // 当状态为pending时，将then方法回调函数加入执行队列等待执行
      case PENDING:
        this.fulfilledQueues.push(fulfilled)
        this.rejectedQueues.push(rejected)
        break
      // 当状态已经改变时，立即执行对应的回调函数
      case FULFILLED:
        fulfilled(value)
        break
      case REJECTED:
        rejected(reason)
        break
    }
  })

}
module.exports = MyPromise
