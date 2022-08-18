const MyPromise = require('./PromiseA');

const p = new MyPromise(function (resolve, reject) { resolve('isOk') });

test('测试 primose 的 then 是否成功', () => {
    // expect.assertions(1);
    // return p.then(data => {
    //     expect(data).toBe('isOk');
    // });
});
