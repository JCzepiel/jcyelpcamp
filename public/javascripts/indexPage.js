const allNumberedPaginationButtons = document.querySelectorAll("#numberedPaginationButton")
const allWordedPaginationButtons = document.querySelectorAll("#wordedPaginationButton")
const allCards = document.querySelectorAll("#indexpagecard")

var currentPageNumber = parseInt(currentPage)
var mapMarker
const arrayOfNumberedPaginationButtons = [...allNumberedPaginationButtons]
const arrayOfAllCurrentPageButtonNumbers = arrayOfNumberedPaginationButtons.map(e => parseInt(e.innerText))


doStuffOnLoad()

function doStuffOnLoad() {
    addEventListenerToAllCards()
    updatePageNumbersForAllNumberedPaginationButtons()
    toggleActiveStateForAllNumberedPaginationButtons()
    addEventListenerToWordedPaginationButtons()
    addEventListenerToNumberedPaginationButtons()
}

function codeToRunAfterAPIRequestIsMade() {
    updatePageNumbersForAllNumberedPaginationButtons()
    toggleActiveStateForAllNumberedPaginationButtons()

    if (mapMarker) {
        mapMarker.remove()
    }
}

function addEventListenerToNumberedPaginationButtons() {
    for (aNumberedPaginationButton of allNumberedPaginationButtons) {
        aNumberedPaginationButton.addEventListener('click', function (event) {
            event.preventDefault()
            this.blur()

            makeAPIRequestUsingURL(`/api/index?page=${this.innerText}&limit=${numberPerPage}`)
                .then(data => {
                    updateAllCardsWithNewData(data)

                    currentPage = this.innerText
                    currentPageNumber = parseInt(currentPage)

                    codeToRunAfterAPIRequestIsMade()
                });
        })
    }
}

function addEventListenerToWordedPaginationButtons() {
    for (aWordedPaginationButton of allWordedPaginationButtons) {

        if (aWordedPaginationButton.innerText === "Next") {
            aWordedPaginationButton.addEventListener('click', function (event) {
                event.preventDefault()
                this.blur()

                var wordedPaginationPageNumber = currentPageNumber
                wordedPaginationPageNumber++

                makeAPIRequestUsingURL(`/api/index?page=${wordedPaginationPageNumber}&limit=${numberPerPage}`)
                    .then(data => {
                        updateAllCardsWithNewData(data)

                        currentPage = wordedPaginationPageNumber
                        currentPageNumber = parseInt(currentPage)

                        codeToRunAfterAPIRequestIsMade()
                    });
            })
        } else if (aWordedPaginationButton.innerText === "Previous") {
            aWordedPaginationButton.addEventListener('click', function (event) {
                event.preventDefault()
                this.blur()

                if (currentPageNumber !== 1) {
                    var wordedPaginationPageNumber = currentPageNumber
                    wordedPaginationPageNumber--

                    makeAPIRequestUsingURL(`/api/index?page=${wordedPaginationPageNumber}&limit=${numberPerPage}`)
                        .then(data => {
                            updateAllCardsWithNewData(data)

                            currentPage = wordedPaginationPageNumber
                            currentPageNumber = parseInt(currentPage)

                            updatePageNumbersForAllNumberedPaginationButtons()
                            toggleActiveStateForAllNumberedPaginationButtons()

                        });
                }
            })
        }
    }
}

function addEventListenerToAllCards() {
    for (aCard of allCards) {
        aCard.addEventListener('mouseenter', function (event) {
            runOnCardHoveredOn(event)
        })
    }
}

function updatePageNumbersForAllNumberedPaginationButtons() {
    allNumberedPaginationButtons.forEach(function (numberedPaginationButton, index) {
        numberedPaginationButton.innerText = `${currentPageNumber - (2 - index)}`
    })

    allNumberedPaginationButtons.forEach(function (numberedPaginationButton, index) {
        if (parseInt(numberedPaginationButton.innerText) < 1) {
            numberedPaginationButton.parentElement.style.display = 'none';
        } else {
            numberedPaginationButton.parentElement.style.display = 'inline';
        }
    })
}

function toggleActiveStateForAllNumberedPaginationButtons() {

    for (const [index, aNumberedPaginationButton] of allNumberedPaginationButtons.entries()) {
        // Always set the active one of the middle one
        if (index === 2) {
            aNumberedPaginationButton.parentElement.classList.add('active')
        } else {
            aNumberedPaginationButton.parentElement.classList.remove('active')
        }

        // Also, let's check for negative numbers and disable
        if (parseInt(aNumberedPaginationButton.innerText) < 1) {
            aNumberedPaginationButton.parentElement.classList.add('disabled')
        } else {
            aNumberedPaginationButton.parentElement.classList.remove('disabled')
        }
    }

}

function runOnCardHoveredOn(event) {
    var title = ''
    for (possibleTitle of event.target.getElementsByClassName('card-title')) {
        title = possibleTitle.innerText
    }

    const hoveredCamp = parsedCamps.find(el => el.title === title);

    if (hoveredCamp) {
        if (mapMarker) {
            mapMarker.remove()
        }

        mapMarker = new mapboxgl.Marker()
            .setLngLat(hoveredCamp.geometry.coordinates)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 })
                    .setHTML(
                        `<h3>${hoveredCamp.title}</h3><p>${hoveredCamp.location}</p>`
                    )
            )
            .addTo(map);
    }
}


async function makeAPIRequestUsingURL(url = '') {
    console.log(`Making request for: ${url}...`)
    const response = await fetch(url, {
        method: 'GET',
    });
    return response.json();
}

function updateAllCardsWithNewData(newCardData) {
    for (const [index, aCamp] of newCardData.entries()) {
        updateSingleCardWithNewCampData(allCards[index], aCamp)
    }
}

function updateSingleCardWithNewCampData(aCard, newCamp) {
    const cardImage = aCard.querySelector('.card-image')
    const cardTitle = aCard.querySelector('.card-title')
    const cardDescription = aCard.querySelector('.card-text')
    const cardLocation = aCard.querySelector('.card-location')
    const cardButton = aCard.querySelector('.card-more-button')

    cardImage.src = newCamp.images[0].url.replace('/upload', '/upload/w_auto,c_scale')
    cardTitle.innerText = newCamp.title
    cardDescription.innerText = newCamp.description
    cardLocation.innerText = newCamp.location
    cardButton.href = `/campgrounds/${newCamp._id}`
}