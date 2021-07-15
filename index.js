axios.get('https://www.hebcal.com/zmanim?cfg=json&geonameid=3448439&date=2021-03-23')
    .then(function (response) {
        console.log(response.data);
        let date = response.data["date"]
        let location = response.data["location"]["name"]
        let minchaGedola = response.data["times"]["minchaGedola"]
        let plagHaMincha = response.data["times"]["plagHaMincha"]
        let shkia = response.data["times"]["sunset"]
        let tzeis50min = response.data["times"]["tzeit50min"]
        console.log("tzeis50min", tzeis50min)
    })
    .catch(function (error) {
        console.log(error);
    })