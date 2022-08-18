const myPromise = require('./index');

var p = new myPromise(function (resolve, reject) { resolve('isOk') });
test('测试primose的then是否成功', () => {
  expect.assertions(1);
  return p.then(data => {
    expect(data).toBe('isOk');
  });
});

it('测试 promise 的 reject 是否成功', async () => {
  var p = new myPromise(() => ddd);
  p.then(null, (e) => {
    expect(e instanceof ReferenceError).toBeTruthy()
    expect(e.message).toBe('ddd is not defined');
  })
})