import mongoose from 'mongoose'

const {Schema} = mongoose

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken: String,
    resetTokenExpiration:Date,
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

const method = userSchema.methods

method.clearCart = function() {
    this.cart = {items:[]}
    return this.save()
}

method.addToCart = function(product){
    const cartProduct = this.cart.items.findIndex(cp => {
        return cp.productId.toString() == product._id.toString()
    })

    const updateCartItems = this.cart.items

    if(cartProduct >= 0){
        ++updateCartItems[cartProduct].quantity 
    }else{
        updateCartItems.push({
            productId: product._id,
            quantity: 1
        })
    }
    return this.save()
}

method.deleteItemfromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString()
    })
    this.cart.items = updatedCartItems
    return this.save()
}

export default mongoose.model('User',userSchema)

 