const myPromise = require('./index');

const p1 = new myPromise(function (resolve, reject) { resolve('isOk') });
test('测试primose的then是否成功', () => {
  expect.assertions(1);
  p1.then(data => {
    expect(data).toBe('isOk');
  });
});


test('测试异步primose的then是否成功', async () => {
  expect.assertions(1);
  const p2 = new myPromise(function (resolve, reject) { 
    setTimeout(()=> 
      resolve('isOk')
    , 1000)
  });
  await p2.then(data => {
    expect(data).toBe('isOk');
  });
});


test('测试primose的then函数的错误函数入参', () => {
  expect.assertions(1);
  const p3 = new myPromise(function (_resolve, reject) { 
    reject('isno')
  });
  p3.then(data => {
    expect(data).toBe('isOk');
  }, err => {
    expect(err).toBe('isno');
  });
});

const p4 = new myPromise(function (_resolve, reject) { 
  setTimeout(()=> reject('isno'), 1000)
});
test('测试异步primose的then函数的错误函数入参', () => {
  expect.assertions(1);
  p4.then(data => {
    expect(data).toBe('isOk');
  }, err => {
    expect(err).toBe('isno');
  });
});

const p5 = new myPromise(function (resolve, reject) { resolve('isOk') });
test('测试primose的连续then是否成功', () => {
  expect.assertions(2);
  p5.then(data => {
    expect(data).toBe('isOk');
    return 'isOk'
  }).then(data => {
    expect(data).toBe('isOk');
  });
});

const p6 = new myPromise(function (resolve, reject) { 
  setTimeout(()=> resolve('isOk'), 1000)
});
test('测试异步primose的连续then是否成功', () => {
  expect.assertions(2);
  p6.then(data => {
    expect(data).toBe('isOk');
    return 'isOk'
  }).then(data => {
    expect(data).toBe('isOk');
  });
});

const p7 = new myPromise(function (_resolve, reject) { 
  reject('isno')
});
test('测试primose的连续then函数的错误函数入参', () => {
  expect.assertions(2);
  p7.then(data => {
    expect(data).toBe('isOk');
  },err => {
    expect(err).toBe('isno');
  }).then(data => {
    expect(data).toBe('isOk');
  },err => {
    expect(err).toBe('isno');
  });
});

const p8 = new myPromise(function (_resolve, reject) { 
  setTimeout(()=> reject('isno'), 1000)
});
test('测试异步primose的连续then函数的错误函数入参', () => {
  expect.assertions(2);
  p8.then(data => {
    expect(data).toBe('isOk');
  },err => {
    expect(err).toBe('isno');
  }).then(data => {
    expect(data).toBe('isOk');
  },err => {
    expect(err).toBe('isno');
  });
});
