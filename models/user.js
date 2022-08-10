import mongodb from 'mongodb'
import { getDb } from '../util/database.js'

class User{
    constructor(name,email,cart,id){
        this.name = name
        this.email = email
        this.cart = cart
        this._id = id
    }
    save(){
        const db = getDb()
        return db  
            .collection('users')
            .insertOne(this)
            .then(result => {
                console.log(result)
            })
            .catch(err => console.log(err))
    }

    addToCart(product){
        const updateCart = {items:[{...product,quantity:1}]}
        const db = getDb()
        return db
            .collection('users')
            .updateOne(
                {_id: new mongodb.ObjectId(this.id)},
                {$set:{cart:updateCart}}
            )
            .then(result => {
                console.log(result)
            })
            .catch(err => {
                console.log(err)
                throw err
            })
    }

    static findById(userId){
        const db = getDb()
        return db
            .collection('users')
            .find({_id:new mongodb.ObjectId(userId)})
            .next()
            .then(user => {
                console.log(user)
                return user
            })
            .catch(err => {
                console.log(err)
                throw err
            })
    }
}

export default User