import mongoose from 'mongoose'

const {Schema} = mongoose

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    cart:{
        items:[
            {
                productId:{
                    type:Schema.Types.ObjectId,
                    ref:'Product',
                    required:true
                },
                quantity:{type:Number, required:true}
            }
        ]
    }
})

export default mongoose.model('User',userSchema)

// import mongodb, { ObjectId } from 'mongodb'
// import { getDb } from '../util/database.js'

// class User{
//     constructor(name,email,cart,id){
//         this.name = name
//         this.email = email
//         this.cart = cart
//         this._id = id
//     }
//     save(){
//         const db = getDb()
//         return db  
//             .collection('users')
//             .insertOne(this)
//             .then(result => {
//                 console.log(result)
//             })
//             .catch(err => console.log(err))
//     }

//     addToCart(product){
//         const cartProduct = this.cart.items.findIndex(cp => {
//             return cp.productId.toString() == product._id.toString()
//         })

//         let newQuantity = 1
//         const updateCartItems = [...this.cart.items]

//         if(cartProduct >= 0){
//             newQuantity = this.cart.items[cartProduct].quantity+1
//             updateCartItems[cartProduct].quantity = newQuantity
//         }else{
//             updateCartItems.push({
//                 productId: new ObjectId(product._id),
//                 quantity: newQuantity
//             })
//         }

//         const db = getDb()
//         return db
//             .collection('users')
//             .updateOne(
//                 {_id: new ObjectId(this._id)},
//                 {$set:{cart:{items:updateCartItems}}}
//             )
//             .then(result => {
//                 console.log(result)
//             })
//             .catch(err => {
//                 console.log(err)
//                 throw err
//             })
//     }

//     getCart(){
//         const db = getDb()

//         const productsIds = []
//         const quantities = {}

//         this.cart.items.forEach(element => {
//             let prodId = element.productId

//             productsIds.push(prodId)
//             quantities[prodId] = element.quantity
//         });

//         return db
//             .collection('products')
//             .find({_id:{$in: productsIds}})
//             .toArray()
//             .then(products => {
//                 return products.map(p => {
//                     return {...p,quantity:quantities[p._id]}
//                 })
//             })
//     }

//     deleteItemfromCart(productId){
//         const updatedCartItems = this.cart.items.filter(item => {
//             return item.productId.toString() !== productId.toString()
//         })
//         const db = getDb()
//         return db
//             .collection('users')
//             .updateOne(
//                 {_id: new ObjectId(this._id)},
//                 {$set:{cart:{items:updatedCartItems}}}
//             )
//             .then(result => {
//                 console.log(result)
//             })
//             .catch(err => {
//                 console.log(err)
//                 throw err
//             })
//     }

//     addOrder(){
//         const db = getDb()
//         return this.getCart()
//             .then(products => {
//             const order = {
//                 items: products,
//                 user:{
//                     _id: new ObjectId(this._id),
//                     name:this.name
//                 }
//             }
//             return db 
//                 .collection('orders')
//                 .insertOne(order)
//         })        
//         .then(result => {
//             return db
//                 .collection('users')
//                 .updateOne(
//                     {_id:new ObjectId(this._id)},
//                     {$set:{cart:{items:[]}}}
//                 )
//         })
//         .catch()
//     }

//     getOrders(){
//         const db = getDb()
//         return db
//             .collection('orders')
//             .find({'user._id': new ObjectId(this._id)})
//             .toArray()
//     }

//     static findById(userId){
//         const db = getDb()
//         return db
//             .collection('users')
//             .find({_id:new mongodb.ObjectId(userId)})
//             .next()
//             .then(user => {
//                 console.log(user)
//                 return user
//             })
//             .catch(err => {
//                 console.log(err)
//                 throw err
//             })
//     }
// }

// export default User