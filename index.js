axios.get('https://www.hebcal.com/zmanim?cfg=json&geonameid=3448439&date=2021-03-23')
    .then(function (response) {
        console.log(response.data);
    })
    .catch(function (error) {
        console.log(error);
    })