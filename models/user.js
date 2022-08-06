const getDb = require('../util/database').getDb
const mongodb = require('mongodb')

class User{
    constructor(name,email){
        this.name = name
        this.email = email
    }
    save(){
        const db = getDb
        return db  
            .collection('users')
            .insertOne(this)
            .then(result => {
                console.log(result)
            })
            .catch(err => console.log(err))
    }
    static findById(userId){
        const db = getDb
        return db
            .collection('users')
            .find({_id: new mongodb.ObjectId(userId)})
            .next()
            .then(user => {
                console.log(user)
            })
            .catch(err => {
                console.log(err)
                throw err
            })
    }
}

module.exports = User