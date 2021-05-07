var myCarousel = document.querySelector('#campgroundCarousel')

myCarousel.addEventListener('slide.bs.carousel', function () {
    var cl = cloudinary.Cloudinary.new({ cloud_name: "drt7rlp98" });

    // This is nesssecary because this carousel event is called BEFORE the next img appears on the screen, and BEFORE it has a width
    // We set a minor timeout so that by the time cl.responsive() is called, the img is on the screen and has a width
    setTimeout(function () {
        cl.responsive();
    }, 1);
})