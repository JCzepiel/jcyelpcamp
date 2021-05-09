const allNumberedPaginationButtons = document.querySelectorAll("#numberedPaginationButton")
const allWordedPaginationButtons = document.querySelectorAll("#wordedPaginationButton")
const allCards = document.querySelectorAll("#indexpagecard")

for (aCard of allCards) {
    aCard.addEventListener('mouseenter', function (event) {
        cardHovered(event)
    })
}


var currentPageNumber = parseInt(currentPage)

const arrayOfNumberedPaginationButtons = [...allNumberedPaginationButtons]

const arrayOfAllCurrentPageButtonNumbers = arrayOfNumberedPaginationButtons.map(e => parseInt(e.innerText))

if (arrayOfAllCurrentPageButtonNumbers.some(el => el > (currentPageNumber + 2)) || arrayOfAllCurrentPageButtonNumbers.some(el => el < (currentPageNumber - 2))) {
    // If any button number is greater than current page + 2 or less than current page - 2, that means we need to update the button numbers and shift them over to center on the new current page number
    allNumberedPaginationButtons.forEach(function (numberedPaginationButton, index) {
        numberedPaginationButton.innerText = `${currentPageNumber - (2 - index)}`
    })
}

for (aNumberedPaginationButton of allNumberedPaginationButtons) {
    aNumberedPaginationButton.href = `/campgrounds?page=${aNumberedPaginationButton.innerText}&limit=${numberPerPage}`

    if (aNumberedPaginationButton.innerText === currentPage) {
        aNumberedPaginationButton.parentElement.classList.toggle('active')
    }
}

for (aWordedPaginationButton of allWordedPaginationButtons) {

    if (aWordedPaginationButton.innerText == "Next") {
        aWordedPaginationButton.href = `/campgrounds?page=${currentPageNumber + 1}&limit=${numberPerPage}`
    } else if (aWordedPaginationButton.innerText == "Previous") {
        aWordedPaginationButton.href = `/campgrounds?page=${currentPageNumber - 1}&limit=${numberPerPage}`
    }
}
var mapMarker
function cardHovered(event) {

    var title = ''
    for (possibleTitle of event.target.getElementsByClassName('card-title')) {
        title = possibleTitle.innerText
    }

    console.log('searching for inner text: ', title)

    const hoveredCamp = parsedCamps.find(el => el.title === title);

    console.log('hoveredCamp: ', hoveredCamp)


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