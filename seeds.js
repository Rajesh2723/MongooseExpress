const mongoose = require('mongoose'); ////to give initial data for database we are building this file.it runs on its own.

const Product=require('./models/product');
mongoose.connect('mongodb://127.0.0.1:27017/farmStand', { useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO Connection Open");
    })
    .catch(err => {
        console.log(" MONGO OH its Error");
        console.log(err);
    });


    const seedProduct = [
        {
            name: 'Ruby GrapeFruit',
            price: 1.99,
            category: 'fruit'
        },
        {
            name: 'Banana',
            price: 0.79,
            category: 'fruit'
        },
        {
            name: 'Broccoli',
            price: 2.50,
            category: 'vegetable'
        },
        {
            name: 'Carrot',
            price: 1.25,
            category: 'vegetable'
        },
        {
            name: 'Strawberries',
            price: 3.99,
            category: 'fruit'
        },
        {
            name: 'Spinach',
            price: 2.99,
            category: 'vegetable'
        },
        {
            name: 'Apple',
            price: 1.50,
            category: 'fruit'
        },
        {
            name: 'Tomato',
            price: 1.75,
            category: 'vegetable'
        },
        {
            name: 'Blueberries',
            price: 4.99,
            category: 'fruit'
        },
        {
            name: 'Cucumber',
            price: 1.30,
            category: 'vegetable'
        }
    ];
    

    // const p=new Product({
    //     name:'Ruby GrapeFruit',
    //     price:1.99,
    //     category:'fruit'

    // })
    // p.save().then(p=>{
    //     console.log(p);
    // })
    // .catch(e=>{
    //      console.log(e);
    // })
Product.insertMany(seedProduct)
.then(res=>{
    console.log(res);
})
.catch(e=>{
    console.log(e);
})


