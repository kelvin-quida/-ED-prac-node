import { default as mongodb } from 'mongodb';
let MongoClient = mongodb.MongoClient;

let _db
let pass = process.env.MY_PASS

export const mongoConnect = callback => {
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

export const getDb = () => {
    if(_db){
        return _db
    }
    console.log('n')
}