function getInputValue() {
    let inputVal = document.getElementById("zipcode").value;
    console.log(inputVal);
    let thisFridaySlashes = moment().endOf('week').subtract(1, 'day').format("L");
    let thisFridayDashes = ""

    let temporaryDay = {}
    for (let index = 0; index < 4; index++) {

        splitDay = thisFridaySlashes.split("/")
        thisFridayDashes += splitDay[2]
        thisFridayDashes += "-"
        thisFridayDashes += splitDay[0]
        thisFridayDashes += "-"
        thisFridayDashes += splitDay[1]

        axios.get(`https://www.hebcal.com/zmanim?cfg=json&zip=${inputVal}&date=${thisFridayDashes}`)
            .then(function (response) {
                console.log(response.data);
                let location = response.data.location.name
                let date = moment(response.data["date"], "YYYY MM DD").format("LL");
                let minchaGedola = moment(response.data["times"]["minchaGedola"], "YYYY-MM-DDTHH:mm:ss").format("h:mm A")
                let plagHaMincha = moment(response.data["times"]["plagHaMincha"], "YYYY-MM-DDTHH:mm:ss").format("h:mm A")
                let legibleShkia = moment(response.data["times"]["sunset"], "YYYY-MM-DDTHH:mm:ss").format("h:mm A")
                let tzeis50min = moment(response.data["times"]["tzeit50min"], "YYYY-MM-DDTHH:mm:ss").format("h:mm A")
                let earlyMincha = moment(response.data["times"]["plagHaMincha"]).subtract(15, "minutes").format('LT')
                let candleLighting = moment(response.data["times"]["sunset"]).subtract(18, "minutes").format('LT')
                console.log("Location:", location, "Date:", date, "Mincha Gedola:", minchaGedola, "Early Mincha:", earlyMincha, "Plag:", plagHaMincha, "Candle Lighting:", candleLighting, "Shkia:", legibleShkia, "Tzeis 50 Min:", tzeis50min)

                temporaryDay["location"] = location
                temporaryDay["date"] = date
                temporaryDay["minchaGedola"] = minchaGedola
                temporaryDay["plagHaMincha"] = plagHaMincha
                temporaryDay["legibleShkia"] = legibleShkia
                temporaryDay["tzeis50min"] = tzeis50min
                temporaryDay["earlyMincha"] = earlyMincha
                temporaryDay["candleLighting"] = candleLighting
                console.log(temporaryDay)
            })
            .catch(function (error) {
                console.log(error.response.data.error);
                console.log(error.response.status);
                alert(error.response.data.error);
            });
        thisFridayDashes = ""
        thisFridaySlashes = moment(thisFridaySlashes).add(7, "day").format("L")
    }
}
