


const Promisify = (asyncFunc, params) => new Promise((resolve, reject) => {
    asyncFunc(params, res => resolve(res))

})


module.exports = Promisify