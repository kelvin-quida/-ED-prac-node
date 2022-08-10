import  mongodb from 'mongodb';
import dotenv from 'dotenv'
let MongoClient = mongodb.MongoClient;

dotenv.config()

let _db

export const mongoConnect = callback => {
    MongoClient.connect(`mongodb+srv://${process.env.MY_USER}:${process.env.MY_PASS}@cluster0.t3haj.mongodb.net/shop?retryWrites=true&w=majority`)
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

export const getDb = () => {
    if(_db){
        return _db
    }
    console.log('NOT FOUND DB')
}