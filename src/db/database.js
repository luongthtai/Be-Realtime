const mySql = require('mysql')

const connection = mySql.createConnection({
    host: 'localhost',
    user: 'luongtai',
    password: '123456',
    database: 'chatchat'
})

module.exports = connection