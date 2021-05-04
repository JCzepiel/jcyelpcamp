const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const { places, descriptors, uploadedimages } = require('./seedHelpers')

const mapboxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const mapboxToken = process.env.MAPBOX_PUBLIC_TOKEN
const geocoder = mapboxGeocoding({ accessToken: mapboxToken })

const databaseURL = process.env.MONGO_DB_URL || 'mongodb://localhost:27017/yelp-camp'

mongoose.connect(databaseURL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"))
db.once('open', () => {
    console.log(`Database connected at ${databaseURL}...`)
})

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})

    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10

        const randomLocation = `${cities[random1000].city}, ${cities[random1000].state}`

        const random0to2 = Math.floor(Math.random() * 3)
        const random0to29 = Math.floor(Math.random() * 30)
        var seededimages = [uploadedimages[random0to29]]
        for (let i = 0; i < random0to2; i++) {
            const anotherRandom0to29 = Math.floor(Math.random() * 30)
            seededimages.push(uploadedimages[anotherRandom0to29])
        }

        const camp = new Campground({
            location: randomLocation,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: seededimages,
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

