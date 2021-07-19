axios.get('https://www.hebcal.com/zmanim?cfg=json&geonameid=3448439&date=2021-03-23')
    .then(function (response) {
        console.log(response.data);
        let date = response.data["date"]
        let location = response.data["location"]["name"]
        let minchaGedola = response.data["times"]["minchaGedola"]
        let plagHaMincha = response.data["times"]["plagHaMincha"]
        let shkia = response.data["times"]["sunset"]
        let tzeis50min = response.data["times"]["tzeit50min"]

        let formatedDate = moment(date, "YYYY MM DD").format("LL");
        let formatedMinchaGedola = moment(minchaGedola, "YYYY-MM-DDTHH:mm:ss").format("h:mm A")
        let formatedPlagHaMincha = moment(plagHaMincha, "YYYY-MM-DDTHH:mm:ss").format("h:mm A")
        let formatedShkia = moment(shkia, "YYYY-MM-DDTHH:mm:ss").format("h:mm A")
        let formatedTzeis50min = moment(tzeis50min, "YYYY-MM-DDTHH:mm:ss").format("h:mm A")
        console.log("Date", formatedDate, "Mincha Gedola", formatedMinchaGedola, "Plag", formatedPlagHaMincha, "Shkia", formatedShkia, "Tzeis 50 Min", formatedTzeis50min)
    })
    .catch(function (error) {
        console.log(error);
    })