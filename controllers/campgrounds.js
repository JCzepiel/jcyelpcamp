const Campground = require('../models/campground')

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
    const camp = new Campground(req.body.campground)
    camp.author = req.user._id
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

    req.flash('success', 'Successfully updated Campground!')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params

    const camp = await Campground.findByIdAndDelete(id)

    req.flash('success', 'Successfully deleted a campground!')
    res.redirect(`/campgrounds`)
}