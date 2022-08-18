const myPromise = require('./index');

var ok = new myPromise(function (resolve, reject) { resolve('isOk') });
var notOk = new myPromise(function (resolve, reject) { reject('isNotOk') });
describe('promise', function () {
  test('测试primose的then是否成功', () => {
    expect.assertions(1);
    return ok.then(data => {
      expect(data).toBe('isOk');
    });
  });
  test('测试primose的catch是否成功', () => {
    expect.assertions(1);
    return notOk
      .then((res) => {
        console.log('nothing');
      })
      .catch(data => {
        expect(data).toBe('isNotOk');
      });
  });
});

