const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const mongoConnect = callback => {
    MongoClient.connect('mongodb+srv://Armit4ge:pAYLgo7QnP01oPCS@cluster0.t3haj.mongodb.net/?retryWrites=true&w=majority')
    .then(client => {
        console.log("Connected")
        callback(client)
    })
    .catch(err => console.log(err))

}

module.exports = mongoConnect