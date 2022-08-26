function myPromise(constructor) {
  let self = this;

  self.status = "pending" //定义状态改变前的初始状态

  self.value = undefined;//定义状态为resolved的时候的状态

  self.reason = undefined;//定义状态为rejected的时候的状态

  function resolve(value) {
    self.value = value
    if(self.status !== 'pending'){
      return
    }
    self.status = 'resolve'
    const { fullfilled } = self
    if(fullfilled){
      fullfilled(self.value)
    }
  }

  function reject(reason) {
    if(self.status !== 'pending'){
      return
    }
    self.reason = reason
    self.status = 'reject'
    // promise的then函数执行时，this值好像是undefined,所以不能直接this.fullfilled
    const { rejected } = self
    if(rejected){
      rejected(reason)
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
  const { status, value, reason} = this
  if(!onFullfilled ||  typeof onFullfilled !== 'function') {
    throw new Error('参数异常，最少需要传入完成函数')
  }
  // 已完成状态直接执行完成函数，并且返回新的已完成状态的promise,数据更新为完成函数的返回值
  if(status == 'resolve'){
    let result = value
    if(onFullfilled && typeof onFullfilled == 'function') {
      // 这里可以trycatch，给出合理错误提示
      result = onFullfilled(value)         
    }
    return new myPromise(function(resolve){ resolve(result)})
  } else if(status == 'reject'){
    // 错误状态直接执行错误函数，并且返回新的错误状态的promise,使用同一个错误对象
    if(onRejected && typeof onRejected == 'function') {
      onRejected(reason)   
    }
    return new myPromise(function(_resolve,reject){ reject(reason)})
  } else {
    const self = this
    // 进行中状态，依然需要返回新的promise对象
    // 感觉两个promise对象耦合了，不过目前没有更好的思路
    return new myPromise(function(resolve,reject){
      self.fullfilled = function(value){
        let result = value 
        // 看别人的作业，想起来这里报错了下个promise要进入reject状态
        try {
          result = onFullfilled(value)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }
      self.rejected = function(reason){
        if(onRejected && typeof onRejected == 'function') {
          onRejected(reason)     
        }
        reject(reason)
      }
    })
  }
}

module.exports = myPromise
