const mongoose = require('mongoose')
const mapboxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')

const mapboxToken = process.env.MAPBOX_PUBLIC_TOKEN
const geocoder = mapboxGeocoding({ accessToken: mapboxToken })

const databaseURL = process.env.MONGO_DB_URL || 'mongodb://localhost:27017/yelp-camp'

const { cloudinary } = require('../cloudinary')
const { campgroundSchema } = require('../schemas')

mongoose.connect(databaseURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"))
db.once('open', () => {
    console.log(`-controllers/api.js: Database connected at ${databaseURL}...`)
})

const Campground = require('../models/campground')

module.exports.getAllCampgrounds = async (req) => {
    const { page, limit } = req.query;

    if (page && limit) {
        const campgrounds = await Campground.find({})
            .limit(limit * 1)
            .skip((page - 1) * limit)
        return campgrounds
    } else {
        const allCampgrounds = await Campground.find({})
        return allCampgrounds
    }
}

module.exports.addNewCampground = async (req) => {
    const { error } = campgroundSchema.validate(req.body)

    if (error) {
        const message = error.details.map(el => el.message).join(',')
        return { success: false, message: message }
    }

    const geodata = await geocoder.forwardGeocode({ query: req.body.campground.location, limit: 1 }).send()
    const camp = new Campground(req.body.campground)
    camp.geometry = geodata.body.features[0].geometry
    if (req.files) {
        camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    }
    camp.author = req.user._id
    await camp.save()
    return camp
}

module.exports.getCampground = async (req) => {
    const camp = await Campground.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author')

    if (!camp) {
        return {}
    }

    return camp
}

module.exports.updateCampground = async (req) => {
    const { error } = campgroundSchema.validate(req.body)

    if (error) {
        const message = error.details.map(el => el.message).join(',')
        return { success: false, message: message }
    }

    const { id } = req.params
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true })

    if (!camp) {
        return { success: false, message: 'no camp with that id' }
    }

    if (req.files) {
        const images = req.files.map(f => ({ url: f.path, filename: f.filename }))
        camp.images.push(...images)
    }

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } }, new: true })
    }

    await camp.save()
    return camp
}

module.exports.deleteCampground = async (req) => {
    const { id } = req.params

    const camp = await Campground.findByIdAndDelete(id)

    if (!camp) {
        return { success: false, message: 'no camp with that id' }
    }

    return { success: true, id: id }
}