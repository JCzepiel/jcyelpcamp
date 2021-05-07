const mapboxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapboxToken = process.env.MAPBOX_PUBLIC_TOKEN
const geocoder = mapboxGeocoding({ accessToken: mapboxToken })

const Campground = require('../models/campground')
const { cloudinary } = require('../cloudinary')

module.exports.index = async (req, res) => {
    const { page = 1, limit = 2 } = req.query;

    const campgrounds = await Campground.find({})
        .limit(limit * 1)
        .skip((page - 1) * limit)

    const count = await Campground.countDocuments();

    res.render('campgrounds/index', { campgrounds, totalPages: Math.ceil(count / limit), currentPage: page })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
    const geodata = await geocoder.forwardGeocode({ query: req.body.campground.location, limit: 1 }).send()
    const camp = new Campground(req.body.campground)
    camp.geometry = geodata.body.features[0].geometry
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    camp.author = req.user._id
    console.log(camp)
    await camp.save()
    req.flash('success', 'Successfully made a new Campground!')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.showCampground = async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')

    if (!camp) {
        req.flash('error', 'No campground found!')
        return res.redirect('/campgrounds')
    }

    res.render('campgrounds/show', { camp })
}

module.exports.renderEditForm = async (req, res) => {
    const camp = await Campground.findById(req.params.id)

    if (!camp) {
        req.flash('error', 'No campground found!')
        return res.redirect('/campgrounds')
    }

    res.render('campgrounds/edit', { camp })
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    camp.images.push(...images)

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }

    await camp.save()
    req.flash('success', 'Successfully updated Campground!')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params

    const camp = await Campground.findByIdAndDelete(id)

    req.flash('success', 'Successfully deleted a campground!')
    res.redirect(`/campgrounds`)
}