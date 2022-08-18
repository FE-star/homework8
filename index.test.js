const myPromise = require('./index');

var p = new myPromise(function (resolve, reject) { resolve('isOk') });
test('测试primose的then是否成功', () => {
  expect.assertions(1);
  return p.then(data => {
    expect(data).toBe('isOk');
  });
});