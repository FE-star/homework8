const myPromise = require('./index');

var p = new myPromise(function (resolve, reject) { resolve('isOk') });
test('测试primose的then是否成功', () => {
  expect.assertions(1);
  return p.then(data => {
    expect(data).toBe('isOk');
  });
});

test('测试primose的then的鏈式調用是否成功', () => {
  expect.assertions(1);
  return p.then(() => {
    return "isfail"
  }).then(data=>{
    expect(data).toBe('isfail');
    // throw new Error("reject");
  })
});
