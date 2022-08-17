import mongoose from "mongoose";

const {Schema} = mongoose

const productSchema = new Schema({
  title:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  imageUrl:{
    type:String,
    required:true
  },
  userId:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
})

export default mongoose.model('Product',productSchema)


// import mongodb, { ObjectId } from 'mongodb'
// import {getDb} from '../util/database.js'

// class Product {
//   constructor(title,imageUrl,price,description,id){
//     this.title = title
//     this.imageUrl = imageUrl
//     this.price = price
//     this.description = description
//     this._id = id
//   }
//   save(){
//     const db = getDb()
//     let dbOp
//     if(this._id){
//       dbOp = db
//         .collection('products')  
//         .updateOne({_id: new mongodb.ObjectId(this._id)}, {$set:this})
//     }else{
//       dbOp = db.collection('products').insertOne(this)
//     }
//     return dbOp
//       .then(result => {
//         console.log(result)
//       })
//       .catch(err => { 
//         console.log(err)
//         throw err
//       })
//   }
//   static fetchAll(){
//     const db = getDb()
//     return db
//       .collection('products')
//       .find()
//       .toArray()
//       .then(result => {
//         console.log(result)
//         return result
//       })
//       .catch(err => console.log(err))
//   }
//   static findById(prodId){
//     const db = getDb()
//     return db
//       .collection('products')
//       .find({_id:new mongodb.ObjectId(prodId)})
//       .next()
//       .then(product => {
//         console.log(product)
//         return product
//       })
//       .catch(err => {
//         console.log(err)
//       })
//   }
//   static deleteById(prodId){
//     const db = getDb()
//     return db
//       .collection('products')
//       .deleteOne({_id:new ObjectId(prodId)})
//       .then(result => {
//         return db
//           .collection('users')
//           .updateOne(
//             {_id:new ObjectId(userId)},
//             {$pull:{'cart.items':{productId: new ObjectId(prodId)}}}
//           )
//       })
//       .catch(err => {
//         console.log(err)
//       })
//   }
// }

// export default Product