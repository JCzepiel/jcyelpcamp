const got = require('got'); // Our Network layer
const jsdom = require("jsdom"); // To create and manipulate a DOM from raw HTML
const fs = require('fs').promises;

const { JSDOM } = jsdom; // Used to create a DOM from raw HTML

const { allStates } = require('./statesandlinks')

// const getInitialStatePages = async () => {
//     const urlToSearch = 'https://en.wikipedia.org/wiki/List_of_U.S._National_Historic_Landmarks_by_state'

//     const response = await got(urlToSearch)

//     const dom = new JSDOM(response.body);

//     // Trial and error has shown me this is the element we care about!
//     const jackpot = dom.window.document.querySelector(".wikitable tbody")

//     // If we do not have the element that contains the information we need, just quit
//     if (!jackpot) {
//         console.log(`REJECTED FOR NO JACKPOT`)
//         return
//     }

//     const allTRsInsideJackpot = jackpot.querySelectorAll('tr')

//     let arrayOfStateNamesAndLinks = []

//     for (aTR of allTRsInsideJackpot) {
//         const firstHREF = aTR.querySelector("a")
//         if (firstHREF) {
//             //console.log(`'https://en.wikipedia.org${firstHREF.href}',`)
//             let newState = {
//                 stateName: firstHREF.textContent,
//                 stateLink: `https://en.wikipedia.org${firstHREF.href}`
//             }
//             arrayOfStateNamesAndLinks.push(newState)
//         }
//     }

//     return arrayOfStateNamesAndLinks
// }

// getInitialStatePages().then((response) => {
//     console.log('getInitialStatePages finished with data:')
//     console.log(response)

//     fs.writeFile(__dirname + '/statesandlinks.json', JSON.stringify(response), function (err) {
//         if (err) {
//             return console.log(err);
//         }

//         console.log("The file was saved!");
//     });
// })

const getAllStateLandmarks = async (stateURL, stateName) => {
    console.log(`Searching ${stateURL}...`)

    const response = await got(stateURL)

    const dom = new JSDOM(response.body);

    // Trial and error has shown me this is the element we care about!
    const jackpot = dom.window.document.querySelector(".wikitable.sortable")

    // If we do not have the element that contains the information we need, just quit
    if (!jackpot) {
        console.log(`REJECTED FOR NO JACKPOT`)
        return
    }

    const allTRsInsideJackpot = jackpot.querySelectorAll('tr.vcard')

    let arrayOfStateNHLs = []

    for (aTR of allTRsInsideJackpot) {
        //This should be the name and include a link!
        const nameAndLinkInsideSpan = aTR.querySelector('span.mapframe-coord-name a')
        if (!nameAndLinkInsideSpan) continue
        const nationalLandmarkWikipediaLink = 'https://en.wikipedia.org' + nameAndLinkInsideSpan.href
        const nationalLandmarkName = nameAndLinkInsideSpan.textContent

        //This should be the image!
        const imageLinkInsideDivs = aTR.querySelector('div.center div.floatnone a')
        if (!imageLinkInsideDivs) continue
        const nationalLandmarkImageLink = 'https://en.wikipedia.org' + imageLinkInsideDivs.href

        //This should be its designated date
        const spanWithInnerText = aTR.querySelector('span[data-sort-value]')
        if (!spanWithInnerText) continue
        const nationalLandmarkDateDesignated = spanWithInnerText.textContent

        //This should be town name and coordinates!
        const spanWithLabel = aTR.querySelector('span.label')
        if (!spanWithLabel) continue
        const nationalLandmarkCity = spanWithLabel.textContent
        const spanWithCoordinates = aTR.querySelector('span.geo-dec')
        if (!spanWithCoordinates) continue
        const nationalLandmarkCoordinates = spanWithCoordinates.textContent

        //This should be the description!
        const tdWithText = aTR.querySelector('td.note')
        if (!tdWithText) continue
        var regexForRemovingCitationMarks = new RegExp(/\[\d+\]/, "gi")
        let nationalLandmarkDescription = tdWithText.textContent
        nationalLandmarkDescription = nationalLandmarkDescription.replace(regexForRemovingCitationMarks, "");

        // After going through everything ... here is all the data we got ...
        // console.log(`----------------------------------------------------------------------------------------------------`)
        // console.log(`NHL Title: ${nationalLandmarkName}`)
        // console.log(`NHL Link: ${nationalLandmarkWikipediaLink}`)
        // console.log(`NHL Image: ${nationalLandmarkImageLink}`)
        // console.log(`NHL Date: ${nationalLandmarkDateDesignated}`)
        // console.log(`NHL City: ${nationalLandmarkCity}`)
        // console.log(`NHL Coordinates: ${nationalLandmarkCoordinates}`)
        // console.log(`NHL Description: ${nationalLandmarkDescription}`)

        let newNHL = {
            nationalLandmarkName: nationalLandmarkName,
            nationalLandmarkWikipediaLink: nationalLandmarkWikipediaLink,
            nationalLandmarkImageLink: nationalLandmarkImageLink,
            nationalLandmarkDateDesignated: nationalLandmarkDateDesignated,
            nationalLandmarkState: stateName,
            nationalLandmarkCity: nationalLandmarkCity,
            nationalLandmarkCoordinates: nationalLandmarkCoordinates,
            nationalLandmarkDescription: nationalLandmarkDescription
        }
        arrayOfStateNHLs.push(newNHL)
    }

    return arrayOfStateNHLs
}

const doItAll = async () => {
    for (aState of allStates) {
        const data = await getAllStateLandmarks(aState.stateLink, aState.stateName)

        console.log(`${aState.stateName} finished with data length: ${data.length}`)

        await fs.writeFile(__dirname + `/states/${aState.stateName}.js`, JSON.stringify(data), 'utf8');
    }
}

doItAll()

// Cahuella@9LQKULP MINGW64 ~/Desktop/Coding/The Web Developer Bootcamp 2021/YelpCamp (master)
// $ node seeds/realdata/realdata.js
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Alabama...
// Alabama finished with data length: 39
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Alaska...
// Alaska finished with data length: 33
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Arizona...
// Arizona finished with data length: 44
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Arkansas...
// Arkansas finished with data length: 17
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_California...
// California finished with data length: 144
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Colorado...
// Colorado finished with data length: 26
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Connecticut...
// Connecticut finished with data length: 63
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Delaware...
// Delaware finished with data length: 14
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Florida...
// Florida finished with data length: 47
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Georgia_(U.S._state)...
// Georgia finished with data length: 48
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Hawaii...
// Hawaii finished with data length: 32
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Idaho...
// Idaho finished with data length: 10
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Illinois...
// Illinois finished with data length: 88
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Indiana...
// Indiana finished with data length: 43
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Iowa...
// Iowa finished with data length: 25
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Kansas...
// Kansas finished with data length: 24
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Kentucky...
// Kentucky finished with data length: 30
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Louisiana...
// Louisiana finished with data length: 53
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Maine...
// Maine finished with data length: 43
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Maryland...
// Maryland finished with data length: 75
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Massachusetts...
// Massachusetts finished with data length: 134
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Michigan...
// Michigan finished with data length: 43
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Minnesota...
// Minnesota finished with data length: 25
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Mississippi...
// Mississippi finished with data length: 37
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Missouri...
// Missouri finished with data length: 35
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Montana...
// Montana finished with data length: 25
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Nebraska...
// Nebraska finished with data length: 18
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Nevada...
// Nevada finished with data length: 7
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_New_Hampshire...
// New Hampshire finished with data length: 23
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_New_Jersey...
// New Jersey finished with data length: 58
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_New_Mexico...
// New Mexico finished with data length: 42
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_New_York...
// New York finished with data length: 157
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_North_Carolina...
// North Carolina finished with data length: 39
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_North_Dakota...
// North Dakota finished with data length: 6
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Ohio...
// Ohio finished with data length: 76
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Oklahoma...
// Oklahoma finished with data length: 17
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Oregon...
// Oregon finished with data length: 17
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Pennsylvania...
// Pennsylvania finished with data length: 102
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Rhode_Island...
// Rhode Island finished with data length: 45
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_South_Carolina...
// South Carolina finished with data length: 74
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_South_Dakota...
// South Dakota finished with data length: 12
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Tennessee...
// Tennessee finished with data length: 31
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Texas...
// Texas finished with data length: 45
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Utah...
// Utah finished with data length: 13
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Vermont...
// Vermont finished with data length: 18
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Virginia...
// Virginia finished with data length: 122
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Washington_(state)...
// Washington finished with data length: 24
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_West_Virginia...
// West Virginia finished with data length: 16
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Wisconsin...
// Wisconsin finished with data length: 44
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_Wyoming...
// Wyoming finished with data length: 25
// Searching https://en.wikipedia.org/wiki/List_of_National_Historic_Landmarks_in_the_District_of_Columbia...
// District of Columbia finished with data length: 75
