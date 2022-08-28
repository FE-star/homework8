const myPromise = require('./index');


function p(bol) {
    return new myPromise((res, rej) => {
        setTimeout(() => {
            bol ? res(bol) : rej(bol);
        }, 2000)
    })
}

const promise = p(true);

const then1 = new Promise((res) => res('aaa22323a'))

const p2 = promise.then(value => {
    console.log(3)
    console.log('resolve', value);
    return 'as222'
})

p2.then(res => {
    console.log('p2', res);
    // throw new Error('错误')
    return [11, 2,3,4]
}, e => {
    console.log('eeeee::::::::')
    console.log(e, "eee::");
}).then(res => {
    console.log('res:', res)
},  e => {
    console.log('233333::::::::')
    console.log(e, "eee::");
}).catch(e => {
    console.log(e, 'eeee');
})


// const promisesAplusTests = require('promises-aplus-tests');

// promisesAplusTests(myPromise, function(err) {
//     console.log(err, '==>>');
//   })