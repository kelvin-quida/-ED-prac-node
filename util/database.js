const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
require('dotenv').config()

let _db
let pass = process.env.MY_PASS

const mongoConnect = callback => {
    MongoClient.connect(`mongodb+srv://Armit4ge:${pass}@cluster0.t3haj.mongodb.net/shop?retryWrites=true&w=majority`)
    .then(client => {
        console.log("Connected")
        _db = client.db()
        callback()
    })
    .catch(err =>{
        console.log(err)
        throw err   
    })
}

const getDb = () => {
    if(_db){
        return _db
    }
    throw "NO DB"
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb