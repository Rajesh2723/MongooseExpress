const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    category:{
        type:String,
        enum:['fruit','vegetable','dairy']
    },
    farm:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Farm'
    }
})
//create model,compile model
const Product=mongoose.model('Product',productSchema); //parameters:modelname,schema.
 
module.exports=Product;

