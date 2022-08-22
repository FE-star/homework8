const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";

function myPromise(constructor) {
    let self = this;

    self.status = PENDING //定义状态改变前的初始状态

    self.value = undefined;//定义状态为resolved的时候的状态

    self.reason = undefined;//定义状态为rejected的时候的状态

    function resolve(value) {

        // TODO resolve如何改变状态及返回结果
        if (self.status === PENDING) {
            self.status = RESOLVED;
            self.value = value;
        }
    }

    function reject(reason) {

        // TODO reject如何改变状态及返回结果
        if (self.status === PENDING) {
            self.status = REJECTED;
            self.reason = reason;
        }
    }

    //捕获构造异常

    try {

        constructor(resolve, reject);

    } catch (e) {

        reject(e);

    }

}

myPromise.prototype.then = function (onFulfilled, onRejected) {
    //TODO then如何实现
    if (this.status === RESOLVED) {
        onFulfilled(this.value);
    } else if (this.status === REJECTED) {
        onRejected(this.reason);
    }
}
module.exports = myPromise
