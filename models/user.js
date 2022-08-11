import mongodb, { ObjectId } from 'mongodb'
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
        const cartProduct = this.cart.items.findIndex(cp => {
            return cp.productId.toString() == product._id.toString()
        })

        let newQuantity = 1
        const updateCartItems = [...this.cart.items]

        if(cartProduct >= 0){
            newQuantity = this.cart.items[cartProduct].quantity+1
            updateCartItems[cartProduct].quantity = newQuantity
        }else{
            updateCartItems.push({
                productId: new ObjectId(product._id),
                quantity: newQuantity
            })
        }

        const updateCart = {
            items:[{productId: new ObjectId(product._id),quantity:newQuantity}]
        }
        const db = getDb()
        return db
            .collection('users')
            .updateOne(
                {_id: new ObjectId(this._id)},
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