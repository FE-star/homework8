const myPromise = require('./index');

var p1 = new myPromise(function (resolve, reject) { resolve('isOk') });
test('测试primose的then是否成功', () => {
  expect.assertions(1);
  return p1.then(data => {
    expect(data).toBe('isOk');
  });
});

var p2 = new myPromise(function (resolve, reject) { 
  setTimeout(()=> 
    resolve('isOk')
  , 1000)
});
test('测试异步primose的then是否成功', () => {
  expect.assertions(1);
  return p2.then(data => {
    expect(data).toBe('isOk');
  });
});


test('测试primose的then函数的错误函数入参', () => {
  expect.assertions(1);
  var p3 = new myPromise(function (_resolve, reject) { 
    reject('isno')
  });
  return p3.then(data => {
    expect(data).toBe('isOk');
  }, err => {
    expect(err).toBe('isno');
  });
});

var p4 = new myPromise(function (_resolve, reject) { 
  setTimeout(()=> reject('isno'), 1000)
});
test('测试异步primose的then函数的错误函数入参', () => {
  expect.assertions(1);
  return p4.then(data => {
    expect(data).toBe('isOk');
  }, err => {
    expect(err).toBe('isno');
  });
});

var p5 = new myPromise(function (resolve, reject) { resolve('isOk') });
test('测试primose的连续then是否成功', () => {
  expect.assertions(2);
  return p5.then(data => {
    expect(data).toBe('isOk');
  }).then(data => {
    expect(data).toBe('isOk');
  });
});

var p6 = new myPromise(function (resolve, reject) { 
  setTimeout(()=> resolve('isOk'), 1000)
});
test('测试异步primose的连续then是否成功', () => {
  expect.assertions(2);
  return p6.then(data => {
    expect(data).toBe('isOk');
  }).then(data => {
    expect(data).toBe('isOk');
  });
});

var p7 = new myPromise(function (_resolve, reject) { 
  reject('isno')
});
test('测试primose的连续then函数的错误函数入参', () => {
  expect.assertions(2);
  return p7.then(data => {
    expect(data).toBe('isOk');
  },err => {
    expect(err).toBe('isno');
  }).then(data => {
    expect(data).toBe('isOk');
  },err => {
    expect(err).toBe('isno');
  });
});

var p8 = new myPromise(function (_resolve, reject) { 
  setTimeout(()=> reject('isno'), 1000)
});
test('测试异步primose的连续then函数的错误函数入参', () => {
  expect.assertions(2);
  return p8.then(data => {
    expect(data).toBe('isOk');
  },err => {
    expect(err).toBe('isno');
  }).then(data => {
    expect(data).toBe('isOk');
  },err => {
    expect(err).toBe('isno');
  });
});
