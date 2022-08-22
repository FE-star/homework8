const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function MyPromise(constructor) {
    let self = this;

    self.status = PENDING //定义状态改变前的初始状态
    self.value = undefined;//定义状态为resolved的时候的状态
    self.reason = undefined;//定义状态为rejected的时候的状态
    self.fulfilledQueue = [];//fulfilled 回调执行函数队列
    self.rejectedQueue = [];//rejected 回调执行函数队列

    function resolve(value) {
        // 状态改变只触发一次（pending-》fulfilled），异步暂时用setTimeout模拟
        if (self.status === PENDING) {
            setTimeout(() => {
                self.status = FULFILLED;
                self.value = value;

                for (let fn of self.fulfilledQueue) {
                    fn(value);
                }
            }, 0);
        }
    }

    function reject(reason) {
        // 状态改变只触发一次（pending-》rejected），异步暂时用setTimeout模拟
        if (self.status === PENDING) {
            setTimeout(() => {
                self.status = REJECTED;
                self.reason = reason;

                for (let fn of self.rejectedQueue) {
                    fn(reason);
                }
            }, 0);
        }
    }

    //捕获构造异常

    try {

        constructor(resolve, reject);

    } catch (e) {

        reject(e);

    }

}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
    if (this.status === PENDING) {
        let fulfilledQueue = this.fulfilledQueue;
        let rejectedQueue = this.rejectedQueue;

        return new MyPromise(function (resolve, reject) {
            fulfilledQueue.push(function (data) {
                try {
                    let value = onFulfilled(data);
                    resolve(value);
                } catch (e) {
                    reject(e);
                }
            });

            rejectedQueue.push(function (data) {
                try {
                    let value = onRejected(data);
                    resolve(value);
                } catch (e) {
                    reject(e);
                }
            })
        });
    } else {
        let value = this.value;
        let reason = this.reason;
        let isFulfilled = this.status === FULFILLED;
        return new MyPromise(function (resolve, reject) {
            try {
                let v = isFulfilled ? onFulfilled(value) : onRejected(reason);
                resolve(v);
            } catch (e) {
                reject(e);
            }
        });
    }
}

module.exports = MyPromise
