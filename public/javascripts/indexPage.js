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

    aNumberedPaginationButton.addEventListener('click', function (event) {
        event.preventDefault()

        // postData(`/api/index?page=${aNumberedPaginationButton.innerText}&limit=${numberPerPage}`)
        //     .then(data => {
        //         console.log(data); // JSON data parsed by `data.json()` call
        //         $("body").html('<h1>HELLO</h1>')
        //     });
    })

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


// Example POST method implementation:
async function postData(url = '') {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

// postData(`/api/index?page=1&limit=3`)
//     .then(data => {
//         console.log(data); // JSON data parsed by `data.json()` call
//     });