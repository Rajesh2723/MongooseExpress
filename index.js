const express=require('express');
const app=express();
const mongoose = require('mongoose');
const Product=require('./models/product');
const path=require('path');
const session=require('express-session');
const flash=require('connect-flash');
const AppError=require('./AppError');
const sessionOptions={secret:'thisisnotasecretanymore',resave:false,saveUninitialized:false};

const Farm=require('./models/farm');
const methodOverride=require('method-override');
app.set('views',path.join(__dirname,'views')); //set path
app.set('view engine','ejs'); //set front-end part ejs
app.use(express.urlencoded({ extended: true })); 
app.use(session(sessionOptions));
app.use(flash());
app.use(methodOverride('_method')); 
//FARM ROUTES
app.use((req,res,next)=>{   //to display messages of sucesss login or failure login
    res.locals.messages=req.flash('success');
    next();
})
app.get('/farms',async (req,res)=>{
    const farms=await Farm.find({});
    res.render('farms/index',{farms });
})
app.get('/farms/new',(req,res)=>{
    res.render('farms/new');
})
app.get('/farms/:id',async(req,res)=>{
    const farm=await Farm.findById(req.params.id).populate('products');
    console.log("required data!!");
    console.log(farm);  
    
    res.render('farms/show',{farm});
})
app.delete('/farms/:id',async (req,res)=>{
    const farm=await Farm.findByIdAndDelete(req.params.id);
    res.redirect('/farms');
})
app.post('/farms',async(req,res)=>{
    console.log(req.body);
    const farm=new Farm(req.body);
    await farm.save();
    req.flash('success','Successfully made a new Farm!!');
    res.redirect('/farms');
})
//PRODUCT ROUTES
categories=['fruit','vegetable','dairy'];
app.get('/farms/:id/products/new',(req,res)=>{
    const {id}=req.params;
    res.render('products/new',{categories,id});
})
app.post('/farms/:id/products',async(req,res)=>{
    const {id}=req.params;
    const farm=await Farm.findById(id);
    console.log(farm);///dubug to find farm 
    const {name,price,category}=req.body;
    const product=new Product({name,price,category});
    farm.products.push(product);
    product.farm=farm;
    await farm.save();
    await product.save();
     res.redirect(`/farms/${id}`);
})
mongoose.connect('mongodb://127.0.0.1:27017/flashDemo', { useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO Connection Open");
    })
    .catch(err => {
        console.log(" MONGO OH its Error");
        console.log(err);
    });

app.listen(3000,()=>{  //listning at port 3000
    console.log("APP IS LISTNING!");
})
app.get('/products/new',(req,res)=>{
    // throw new AppError('NOT ALLOWED',401);//passing message and status
    res.render('products/new1');
})
app.get('/products', async (req,res)=>{ //finding all the products.
   const products=await Product.find({});
   console.log(products);
    res.render('products/index',{products});

})
function wrapAsync(fn){//making a function to handle try and catch and reuse codes
    return function(req,res,next){
        fn(req,res,next).catch(e=>next(e));
    }
}
app.get('/products/:id/edit', wrapAsync(async (req,res,next)=>{ //editing form code 
    const {id}=req.params; //destruct value
    console.log(id);
    const product=await Product.findById(id);
    if(!product){
        next(new AppError('Product Not found',404));
    }
    res.render('products/edit' ,{product});
}))
app.post('/products', wrapAsync(async (req,res,next)=>{ //new products added in form and saved to database.
    
        const newProduct=new Product(req.body);
      await newProduct.save();
      res.redirect(`/products/${newProduct._id}`);
}))
app.put('/products/:id',async (req,res)=>{
    const {id}=req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
        runValidators: true,
        new: true, // Return the updated product
    });
    console.log(req.body);
    res.redirect(`/products/${product._id}`)
    
})
app.delete('/products/:id',async (req,res)=>{ //to delete one product(it takes time so have to use async)
    const {id}=req.params;
    const deletedItem=await Product.findOneAndDelete(id);
     res.redirect('/products')
})
app.use((err,req,res,next)=>{
    const {status=500,message='something went wrong'}=err;
    res.status(status).send(message);
})

app.get('/products/:id',async (req,res)=>{
    const {id}=req.params;
    
    const product=await Product.findById(id);
    console.log(product);
    res.render('products/details',{product});
})
//http://localhost:3000/farms/66c2fbe6ec9b7cce7e82b743/products/new->for adding a form product