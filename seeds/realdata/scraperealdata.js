const got = require('got'); // Our Network layer
const jsdom = require("jsdom"); // To create and manipulate a DOM from raw HTML
const fs = require('fs').promises; // Supports async file write

const { JSDOM } = jsdom; // Used to create a DOM from raw HTML

// The array of all states and the linsk to their data, which is populated by the method getInitialStatePages and used for getAllStateLandmarks
const allStates = require('./statesandlinks.json')

const getInitialStatePages = async () => {
    // This is the base URL to do everything we need
    const urlToSearch = 'https://en.wikipedia.org/wiki/List_of_U.S._National_Historic_Landmarks_by_state'

    // Get the response from this page
    const response = await got(urlToSearch)

    // Turn it into HTML
    const dom = new JSDOM(response.body);

    // Trial and error has shown me this is the element we care about!
    const jackpot = dom.window.document.querySelector(".wikitable tbody")

    // If we do not have the element that contains the information we need, just quit
    if (!jackpot) {
        console.log(`REJECTED FOR NO JACKPOT`)
        return
    }

    // The data we want to look at are the rows of this table
    const allTRsInsideJackpot = jackpot.querySelectorAll('tr')

    // Set up the array where will will store everything and eventually return
    let arrayOfStateNamesAndLinks = []

    // Every row contains all the information we want to save - state name, # of landmarks in state, etc
    for (aTR of allTRsInsideJackpot) {
        const allHREFs = aTR.querySelectorAll("a")
        const allSpans = aTR.querySelectorAll("span")

        // Set up where we will save things, this also allows us to define defaults
        let stateName = ""
        let stateNumberOfLandmarks = 0
        let stateArrayOfLinksToLandmarks = []

        // The number of landmarks is somewhere in a span
        for (aSpan of allSpans) {
            // We want a span that contains a number and that is our number of landmarks
            let spanContent = aSpan.textContent
            if (parseInt(spanContent)) {
                stateNumberOfLandmarks = parseInt(spanContent)
            }
        }

        // The links for each state are in an a element somewhere
        for (aHref of allHREFs) {
            // If the URL contains the word "List" it's probably a list of Landmarks like we want!
            if (aHref.href.indexOf("List") > -1) {
                if (stateName === "") {
                    stateName = aHref.textContent
                }

                stateArrayOfLinksToLandmarks.push(`https://en.wikipedia.org${aHref.href}`)
            }
        }

        // If something went wrong with state name, let's not even save anything and just continue
        if (stateName === "") continue

        // Save all the data we got
        let newState = {
            stateName: stateName,
            stateNumberOfLandmarks: stateNumberOfLandmarks,
            stateLinks: stateArrayOfLinksToLandmarks
        }

        arrayOfStateNamesAndLinks.push(newState)
    }

    // When we are done, return everything we saved
    return arrayOfStateNamesAndLinks
}

// // Get a list of all our states, the number of landmarks in them and links to that state's individual landmarks wikipedia article
// getInitialStatePages().then((response) => {
//     //console.log('getInitialStatePages finished with data:')
//     //console.log(response)

//     // Save all this data to a .json since we will use it later
//     fs.writeFile(__dirname + '/statesandlinks.json', JSON.stringify(response), function (err) {
//         if (err) {
//             return console.log(err);
//         }

//         console.log("The file was saved!");
//     });
// })

const getAllStateLandmarks = async (stateURL, stateName) => {
    // This is the URL we will use to pull all landmarks from the page
    console.log(`Searching ${stateURL}...`)

    // Get the data on the page
    const response = await got(stateURL)

    // Turn it into HTML
    const dom = new JSDOM(response.body);

    // Trial and error has shown me this is the element we care about!
    const jackpot = dom.window.document.querySelector(".wikitable.sortable")

    // If we do not have the element that contains the information we need, just quit
    if (!jackpot) {
        console.log(`REJECTED FOR NO JACKPOT`)
        return
    }

    // All the data we want are contained within these rows
    const allTRsInsideJackpot = jackpot.querySelectorAll('tr.vcard')

    // Set up the array we will use to store data
    let arrayOfStateNHLs = []

    // Each row contains all the information we want, like landmark name, landmark location, etc
    for (aTR of allTRsInsideJackpot) {
        //This should be the name and include a link!
        const nameAndLinkInsideSpan = aTR.querySelector('span.mapframe-coord-name a')
        if (!nameAndLinkInsideSpan) continue
        const nationalLandmarkWikipediaLink = 'https://en.wikipedia.org' + nameAndLinkInsideSpan.href
        const nationalLandmarkName = nameAndLinkInsideSpan.textContent

        //This should be the image!
        const imageLinkInsideDivs = aTR.querySelector('div.center div.floatnone a')

        // Looks like some landmarks do not have image links, so we have to accept that I guess
        let nationalLandmarkImageLink = ""
        if (imageLinkInsideDivs) {
            const tweakedImageLocation = imageLinkInsideDivs.href.replace('/wiki/', '')
            nationalLandmarkImageLink = `https://commons.wikimedia.org/wiki/Special:FilePath/${tweakedImageLocation}`
        }

        //This should be its date designated
        const spanWithInnerText = aTR.querySelector('span[data-sort-value]')
        if (!spanWithInnerText) continue
        const nationalLandmarkDateDesignated = spanWithInnerText.textContent

        //This should be town name and coordinates!
        const spanWithLabel = aTR.querySelector('span.label')
        if (!spanWithLabel) continue
        const nationalLandmarkCity = spanWithLabel.textContent

        // Looks like some landmarks do not have coordinates, so we have to accept that I guess
        const spanWithCoordinates = aTR.querySelector('span.geo-dec')
        let nationalLandmarkCoordinates = ""
        if (spanWithCoordinates) {
            nationalLandmarkCoordinates = spanWithCoordinates.textContent
        }

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

        // If we got this far, we can save all the information and then put it in our array
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

    // At the end, return all the saved landmarks for this state
    return arrayOfStateNHLs
}

// Uses the data from getInitialStatePages to go through every state's list of landmarks and save that data
const getAllLandmarksPerStateForEveryState = async () => {

    for (aState of allStates) {
        // These three "states" are slightly different - they all link to the same wiki page and have three seperate tables on it. Will take more work to handle and not importnat yet
        if (aState.stateName == "U.S. Commonwealths and Territories" ||
            aState.stateName == "Associated States" ||
            aState.stateName == "Foreign States") {
            continue
        }

        let allStateData = []

        // For every state, go through every link and get its DATA
        for (aStateLink of aState.stateLinks) {
            const data = await getAllStateLandmarks(aStateLink, aState.stateName)
            allStateData.push(...data)
        }

        console.log(`${aState.stateName} finished with data length: ${allStateData.length}`)

        // Once we are all done with this state, write it's data to a .json file so we can use it later
        await fs.writeFile(__dirname + `/states/${aState.stateName}.json`, JSON.stringify(allStateData), 'utf8');
    }
}

//getAllLandmarksPerStateForEveryState()