const STATUS = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected',
}

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        reject(new TypeError("The promise and the return value are the same"))
    }

    if (typeof x === 'object' || typeof x === 'function') {
        if (x === null){
            return resolve(x)
        }

        let then
        try {
            then = x.then
        } catch (err) {
            return reject(err)
        }

        if (typeof then === "function") {
            let called = false
            try {
                then.call(x, y => {
                    if (called) {
                        return
                    }
                    called = true
                    resolvePromise(promise2, y, resolve, reject)
                }, err => {
                    if (called) {
                        return
                    }
                    called = true
                    reject(err)
                })
            } catch (err) {
                if (called) {
                    return
                }
                reject(err)
            }
        } else {
            resolve(x)
        }
    } else {
        resolve(x)
    }
}

class MyPromise {
    status = STATUS.PENDING
    value = null
    reason = null

    constructor(executor) {
        executor(this.resolve, this.reject)
    }

    resolve = value => {
        if (this.status === STATUS.PENDING) {
            this.status = STATUS.FULFILLED
            this.value = value

            while (this.onFullFilledCallback.length) {
                this.onFullFilledCallback.shift()(value)
            }
        }
    }

    reject = (reason) => {
        if (this.status === STATUS.PENDING) {
            this.status = STATUS.REJECTED
            this.reason = reason

            while (this.onRejectedCallback.length) {
                this.onRejectedCallback.shift()(reason)
            }}

    }

    onFullFilledCallback = []
    onRejectedCallback = []

    then = function (onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
        onRejected = typeof onRejected === "function" ? onRejected : error => { throw error }

        const promise2 = new MyPromise((resolve, reject) => {

            const fulfilledMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const x = onFulfilled(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (err) {
                        reject(err)
                    }
                })
            }

            const rejectedMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const x = onRejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (err) {
                        reject(err)
                    }
                })
            }

            if (this.status === STATUS.PENDING) {
                this.onFullFilledCallback.push(fulfilledMicrotask)
                this.onRejectedCallback.push(rejectedMicrotask)
            } else if (this.status === STATUS.FULFILLED) {
                fulfilledMicrotask()
            } else if (this.status === STATUS.REJECTED) {
                rejectedMicrotask()
            }
        })

        return promise2
    }
}

MyPromise.deferred = function () {
    const result = {}
    result.promise = new MyPromise(function (resolve, reject) {
        result.resolve = resolve
        result.reject = reject
    })

    return result
}

module.exports = MyPromise
