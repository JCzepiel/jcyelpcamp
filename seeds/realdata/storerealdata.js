// Get the arrays from each state json and save it
const Alabama = require('./states/Alabama.json')
const Alaska = require('./states/Alaska.json')
const Arizona = require('./states/Arizona.json')
const Arkansas = require('./states/Arkansas.json')
const California = require('./states/California.json')
const Colorado = require('./states/Colorado.json')
const Connecticut = require('./states/Connecticut.json')
const Delaware = require('./states/Delaware.json')
const Florida = require('./states/Florida.json')
const Georgia = require('./states/Georgia.json')
const Hawaii = require('./states/Hawaii.json')
const Idaho = require('./states/Idaho.json')
const Illinois = require('./states/Illinois.json')
const Indiana = require('./states/Indiana.json')
const Iowa = require('./states/Iowa.json')
const Kansas = require('./states/Kansas.json')
const Kentucky = require('./states/Kentucky.json')
const Louisiana = require('./states/Louisiana.json')
const Maine = require('./states/Maine.json')
const Maryland = require('./states/Maryland.json')
const Massachusetts = require('./states/Massachusetts.json')
const Michigan = require('./states/Michigan.json')
const Minnesota = require('./states/Minnesota.json')
const Mississippi = require('./states/Mississippi.json')
const Missouri = require('./states/Missouri.json')
const Montana = require('./states/Montana.json')
const Nebraska = require('./states/Nebraska.json')
const Nevada = require('./states/Nevada.json')
const NewHampshire = require('./states/New Hampshire.json')
const NewJersey = require('./states/New Jersey.json')
const NewMexico = require('./states/New Mexico.json')
const NewYork = require('./states/New York.json')
const NorthCarolina = require('./states/North Carolina.json')
const NorthDakota = require('./states/North Dakota.json')
const Ohio = require('./states/Ohio.json')
const Oklahoma = require('./states/Oklahoma.json')
const Oregon = require('./states/Oregon.json')
const Pennsylvania = require('./states/Pennsylvania.json')
const RhodeIsland = require('./states/Rhode Island.json')
const SouthCarolina = require('./states/South Carolina.json')
const SouthDakota = require('./states/South Dakota.json')
const Tennessee = require('./states/Tennessee.json')
const Texas = require('./states/Texas.json')
const Utah = require('./states/Utah.json')
const Vermont = require('./states/Vermont.json')
const Virginia = require('./states/Virginia.json')
const Washington = require('./states/Washington.json')
const WestVirginia = require('./states/West Virginia.json')
const Wisconsin = require('./states/Wisconsin.json')
const Wyoming = require('./states/Wyoming.json')
const DistrictofColumbia = require('./states/District of Columbia.json')

// Unload all that landmark data from each state into a single array
const allLandmarks = [
    ...Alabama,
    ...Alaska,
    ...Arizona,
    ...Arkansas,
    ...California,
    ...Colorado,
    ...Connecticut,
    ...Delaware,
    ...Florida,
    ...Georgia,
    ...Hawaii,
    ...Idaho,
    ...Illinois,
    ...Indiana,
    ...Iowa,
    ...Kansas,
    ...Kentucky,
    ...Louisiana,
    ...Maine,
    ...Maryland,
    ...Massachusetts,
    ...Michigan,
    ...Minnesota,
    ...Mississippi,
    ...Missouri,
    ...Montana,
    ...Nebraska,
    ...Nevada,
    ...NewHampshire,
    ...NewJersey,
    ...NewMexico,
    ...NewYork,
    ...NorthCarolina,
    ...NorthDakota,
    ...Ohio,
    ...Oklahoma,
    ...Oregon,
    ...Pennsylvania,
    ...RhodeIsland,
    ...SouthCarolina,
    ...SouthDakota,
    ...Tennessee,
    ...Texas,
    ...Utah,
    ...Vermont,
    ...Virginia,
    ...Washington,
    ...WestVirginia,
    ...Wisconsin,
    ...Wyoming,
    ...DistrictofColumbia
]

console.log(allLandmarks.length)

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const mongoose = require('mongoose')
const Landmark = require('../../models/landmark')

const databaseURL = process.env.MONGO_DB_URL

mongoose.connect(databaseURL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"))
db.once('open', () => {
    console.log(`-seeds-realdata-storerealdata.js: Database connected at ${databaseURL}...`)
})

const seedDB = async () => {
    await Landmark.deleteMany({})

    // For each landmark, create a new landmark object and save it to the database
    for (aLandmark of allLandmarks) {
        const landmark = new Landmark({
            nationalLandmarkName: aLandmark.nationalLandmarkName,
            nationalLandmarkWikipediaLink: aLandmark.nationalLandmarkWikipediaLink,
            nationalLandmarkImageLink: aLandmark.nationalLandmarkImageLink,
            nationalLandmarkDateDesignated: aLandmark.nationalLandmarkDateDesignated,
            nationalLandmarkState: aLandmark.nationalLandmarkState,
            nationalLandmarkCity: aLandmark.nationalLandmarkCity,
            nationalLandmarkCoordinates: aLandmark.nationalLandmarkCoordinates,
            nationalLandmarkDescription: aLandmark.nationalLandmarkDescription,
        })

        await landmark.save()
    }
}

// seedDB().then(() => {
//     mongoose.connection.close()
// })





