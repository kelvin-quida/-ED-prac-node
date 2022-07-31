const mongodb = require('mongodb')
const { get } = require('../routes/admin')
const MongoClient = mongodb.MongoClient

let _db

const mongoConnect = callback => {
    MongoClient.connect('mongodb+srv://Armit4ge:pAYLgo7QnP01oPCS@cluster0.t3haj.mongodb.net/shop?retryWrites=true&w=majority')
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