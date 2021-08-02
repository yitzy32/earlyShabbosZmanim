function getInputValue() {
    let inputVal = document.getElementById("zipcode").value;
    console.log(inputVal);
}

let thisFridaySlashes = moment().endOf('week').subtract(1, 'day').format("L");
let thisFridayDashes = ""

for (let index = 0; index < 4; index++) {

    splitDay = thisFridaySlashes.split("/")
    thisFridayDashes += splitDay[2]
    thisFridayDashes += "-"
    thisFridayDashes += splitDay[0]
    thisFridayDashes += "-"
    thisFridayDashes += splitDay[1]

    axios.get(`https://www.hebcal.com/zmanim?cfg=json&zip=11210&date=${thisFridayDashes}`)
        .then(function (response) {
            console.log(response.data);

            let date = moment(response.data["date"], "YYYY MM DD").format("LL");
            let minchaGedola = moment(response.data["times"]["minchaGedola"], "YYYY-MM-DDTHH:mm:ss").format("h:mm A")
            let plagHaMincha = moment(response.data["times"]["plagHaMincha"], "YYYY-MM-DDTHH:mm:ss").format("h:mm A")
            let legibleShkia = moment(response.data["times"]["sunset"], "YYYY-MM-DDTHH:mm:ss").format("h:mm A")
            let tzeis50min = moment(response.data["times"]["tzeit50min"], "YYYY-MM-DDTHH:mm:ss").format("h:mm A")
            let earlyMincha = moment(response.data["times"]["plagHaMincha"]).subtract(15, "minutes").format('LT')
            let candleLighting = moment(response.data["times"]["sunset"]).subtract(18, "minutes").format('LT')
            console.log("Date:", date, "Mincha Gedola:", minchaGedola, "Early Mincha:", earlyMincha, "Plag:", plagHaMincha, "Candle Lighting:", candleLighting, "Shkia:", legibleShkia, "Tzeis 50 Min:", tzeis50min)
        })
        .catch(function (error) {
            console.log(error);
        })
    thisFridayDashes = ""
    thisFridaySlashes = moment(thisFridaySlashes).add(7, "day").format("L")
}