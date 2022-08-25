function myPromise(constructor) {
  let self = this;

  self.status = "pending"; //定义状态改变前的初始状态

  self.value = undefined; //定义状态为resolved的时候的状态

  self.reason = undefined; //定义状态为rejected的时候的状态

  self.fulfillTasks = [];

  self.rejectTasks = [];

  function resolve(value) {
    if (self.status !== "pending") return;

    self.status = "fulfilled";
    self.value = value;
    self.fulfillTasks.forEach((fn) => fn());
  }

  function reject(reason) {
    if (self.status !== "pending") return;

    self.status = "rejected";
    self.reason = reason;
    self.rejectTasks.forEach((fn) => fn());
  }

  //捕获构造异常

  try {
    constructor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

myPromise.prototype.then = function (onFullfilled, onRejected) {
  // skip creating new promise
  if (this.status === "fulfilled") {
    onFullfilled(this.value);
  } else if (this.status === "rejected") {
    onRejected(this.reason);
  }

  if (this.status === "pending") {
    this.fulfillTasks.push(() => {
      onFullfilled(this.value);
    });

    this.rejectTasks.push(() => {
      onRejected(this.reason);
    });
  }
};
module.exports = myPromise;
