thisFridaySlashes = moment().endOf('week').subtract(1, 'day').format("L");
let arrayOfDate = thisFridaySlashes.split("/")
let reorderedDateArray = []
reorderedDateArray.push(arrayOfDate[2])
reorderedDateArray.push(arrayOfDate[0])
reorderedDateArray.push(arrayOfDate[1])
let thisFridayDashes = reorderedDateArray.join("-")

axios.get(`https://www.hebcal.com/zmanim?cfg=json&zip=11210&date=${thisFridayDashes}`)
    .then(function (response) {
        console.log(response.data);
        let uglyDate = response.data["date"]
        let location = response.data["location"]["name"]
        let uglyMinchaGedola = response.data["times"]["minchaGedola"]
        let uglyPlagHaMincha = response.data["times"]["plagHaMincha"]
        let uglyShkia = response.data["times"]["sunset"]
        let uglyTzeis50min = response.data["times"]["tzeit50min"]

        let legibleDate = moment(uglyDate, "YYYY MM DD").format("LL");
        let legibleMinchaGedola = moment(uglyMinchaGedola, "YYYY-MM-DDTHH:mm:ss").format("h:mm A")
        let legiblePlagHaMincha = moment(uglyPlagHaMincha, "YYYY-MM-DDTHH:mm:ss").format("h:mm A")
        let legibleShkia = moment(uglyShkia, "YYYY-MM-DDTHH:mm:ss").format("h:mm A")
        let legibleTzeis50min = moment(uglyTzeis50min, "YYYY-MM-DDTHH:mm:ss").format("h:mm A")
        let earlyMincha = moment(uglyPlagHaMincha).subtract(15, "minutes").format('LT')
        let candleLighting = moment(uglyShkia).subtract(18, "minutes").format('LT')
        console.log("Date:", legibleDate, "Mincha Gedola:", legibleMinchaGedola, "Early Mincha:", earlyMincha, "Plag:", legiblePlagHaMincha, "Candle Lighting:", candleLighting, "Shkia:", legibleShkia, "Tzeis 50 Min:", legibleTzeis50min)
    })
    .catch(function (error) {
        console.log(error);
    })