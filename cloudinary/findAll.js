// var cloudinary = require('cloudinary');

// cloudinary.config({
//     cloud_name: 'drt7rlp98',
//     api_key: '521424368919951',
//     api_secret: 'b-U6l7wnoUmSl_k9fiQjAC6-59k',
//     secure: true
// });

// cloudinary.v2.api.resources(
//     { type: 'upload', max_results: 30 },
//     function (error, result) { console.log(result, error); });

// cloudinary.v2.search.expression(
//     'folder:jcyelpcamp/*' // add your folder
// ).sort_by('public_id', 'desc').max_results(30).execute().then(result => console.log(result));