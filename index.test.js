const myPromise = require('./index')

test('测试promise的then是否成功', () => {
  const p = new myPromise(function (resolve, reject) {
    resolve('isOk')
  })
  expect.assertions(1)
  return p.then(data => {
    expect(data).toBe('isOk')
  })
})

test('测试promise的reject是否成功', () => {
  const p = new myPromise(function (resolve, reject) {
    reject('isFail')
  })
  expect.assertions(1)
  return p.then(
    data => {
      expect(data).toBe('isOk')
    },
    err => {
      expect(err).toBe('isFail')
    }
  )
})

test('测试promise的延时then是否成功', done => {
  expect.assertions(1)
  const p = new myPromise(function (resolve, reject) {
    setTimeout(() => {
      resolve('isOk')
    }, 1000)
  })
  p.then(
    data => {
      expect(data).toBe('isOk')
      done()
    },
    err => {
      expect(err).toBe('isFail')
      done()
    }
  )
})
