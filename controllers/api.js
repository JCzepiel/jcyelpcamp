const dataLayer = require('../data/campgrounds')

module.exports.getAllCampgrounds = async (req, res) => {
    const allCampgrounds = await dataLayer.getAllCampgrounds()
    res.send(allCampgrounds)
}

module.exports.addNewCampground = async (req, res) => {
    const camp = await dataLayer.addNewCampground(req)
    res.send(camp)
}

module.exports.getCampground = async (req, res) => {
    const camp = await dataLayer.getCampground(req)
    res.send(camp)
}

module.exports.updateCampground = async (req, res) => {
    const camp = await dataLayer.updateCampground(req)
    res.send(camp)
}

module.exports.deleteCampground = async (req, res) => {
    const camp = await dataLayer.deleteCampground(req)
    res.send(camp)
}