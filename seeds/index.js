const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"))
db.once('open', () => {
    console.log('Database connected at mongodb://localhost:27017/yelp-camp...')
})

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})

    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/drt7rlp98/image/upload/v1619903790/jcyelpcamp/v99ervd67u2al4b8uund.jpg',
                    filename: 'jcyelpcamp/v99ervd67u2al4b8uund'
                },
                {
                    url: 'https://res.cloudinary.com/drt7rlp98/image/upload/v1619903791/jcyelpcamp/q7abpyihva9uc4n51yyl.jpg',
                    filename: 'jcyelpcamp/q7abpyihva9uc4n51yyl'
                }
            ],

            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur nemo minus veritatis eaque. Dignissimos illo facilis necessitatibus beatae cum deleniti velit illum ea aliquam, placeat, dolore dolores aperiam temporibus perspiciatis!',
            price: price,
            author: "608a1aed4fd7b92290842781"
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})

