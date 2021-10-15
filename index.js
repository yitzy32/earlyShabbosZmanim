async function generateCalendar() {

  if (!weeksValidator()) return

  let usersDate = moment(document.getElementById('users-date').value)
  let howManyMinsAfterShkia = document.getElementById("mins-after-shkia").value;
  let howManyWeeks = document.getElementById("how-many-weeks").value;
  let minchaBizmanMinutes = document.getElementById("mincha-bizman-minutes").value;
  let howManyMinsBeforePlag = document.getElementById('mins-before-plag').value;
  let zipcode = document.getElementById("zipcode").value;

  let friday = usersDate.endOf('week').subtract(1, 'day').format("YYYY-MM-DD");

  let loopsCounter = 0;

  for (let index = 0; index < parseInt(howManyWeeks); index++) {
    loopsCounter += 1

    let temporaryDay = {}

    await axios.get(`https://www.hebcal.com/zmanim?cfg=json&zip=${zipcode}&date=${friday}`)
      .then(function (response) {

        temporaryDay["location"] = response.data.location.name
        temporaryDay["date"] = moment(response.data["date"], "YYYY MM DD").format("ll");
        temporaryDay["minchaGedola"] = moment(response.data["times"]["minchaGedola"], "YYYY-MM-DDTHH:mm:ss").format("h:mm A")
        if (dateIsDST(friday)) {
          temporaryDay["earlyMincha"] = moment(response.data["times"]["plagHaMincha"]).subtract(parseInt(howManyMinsBeforePlag), "minutes").format('LT')
        } else {
          temporaryDay["earlyMincha"] = "----"
        }
        temporaryDay["plagHaMincha"] = moment(response.data["times"]["plagHaMincha"], "YYYY-MM-DDTHH:mm:ss").format("h:mm A")
        temporaryDay["candleLighting"] = moment(response.data["times"]["sunset"]).subtract(18, "minutes").format('LT')
        temporaryDay["minchaBizman"] = moment(temporaryDay["candleLighting"], "HH:mm A").add(minchaBizmanMinutes, "minutes").format('LT')
        console.log(temporaryDay['minchaBizman'])
        temporaryDay["shkia"] = moment(response.data["times"]["sunset"], "YYYY-MM-DDTHH:mm:ss").format("h:mm A")
        temporaryDay["tzeis"] = moment(response.data["times"]["sunset"]).add(parseInt(howManyMinsAfterShkia), "minutes").format('LT')
      })
      .catch(function (error) {
        if (error.response.data.error === `Sorry, can't find ZIP code: ${zipcode}`) {
          alert(`Sorry, Can't Find Location: ${zipcode}`)
        } else if (error.response.data.error === "Date must match format YYYY-MM-DD: undefined-Invalid date-undefined") {
          alert(`Invalid Date`)
        }
        console.log(error.response.data.error);
        console.log(error.response.status);
        window.location.reload();
      });

    let [year, month, day] = friday.split("-")

    await axios.get(`https://www.hebcal.com/shabbat?cfg=json&zip=${zipcode}&m=50&a=on&gy=${year}&gm=${month}&gd=${day}`).then(response => {
      const info = response.data.items
      info.forEach(e => {
        if (yomTovDoesntFallOutOnShabbos(e.category)) {
          temporaryDay["parsha"] = e.hebrew
        } else if (yomTovFallsOutOnShabbos(friday, e.date, e.category, e.subcat)) {
          temporaryDay["parsha"] = e.hebrew
        }
      });
    })

    friday = moment(friday).add(7, "day").format("YYYY-MM-DD");

    if (loopIsOnLastItteration(loopsCounter)) {

      document.getElementById('locationH2').innerHTML = `Zmanim For: ${temporaryDay["location"]}`

      document.getElementById('tableHead').innerHTML = "<tr><th>Date</th><th>Mincha Gedola</th><th>Early Mincha</th><th>Plag</th><th class='candle-lighing'>Candle Lighting</th><th>Mincha B'zman</th><th>Shkia</th><th>Tzeis <span id='users-tzeis'></span> Minutes</th></tr>";

      document.getElementById("users-tzeis").innerHTML = howManyMinsAfterShkia;

      document.getElementById('disclaimer').innerHTML = "These times are rounded to the nearest minute. Do not rely on any zman until the last moment.<br /> Double check the accuracy of your new zmanim calendar by visiting <a href=https://www.myzmanim.com/day.aspx?askdefault=1&vars=US" + zipcode + " target='_blank'>MyZmanim</a>"
    }

    document.getElementById('tableData').innerHTML += `<tr>\n<td id="date-column"><span id="english-date">${temporaryDay["date"]}</span> <span id="parsha">${temporaryDay["parsha"]}</span></td>\n<td>${temporaryDay["minchaGedola"]}</td>\n<td>${temporaryDay["earlyMincha"]}</td>\n<td>${temporaryDay["plagHaMincha"]}</td>\n<td class='candle-lighing'>${temporaryDay["candleLighting"]}</td>\n<td>${temporaryDay["minchaBizman"]}</td>\n<td>${temporaryDay["shkia"]}</td>\n<td>${temporaryDay["tzeis"]}</td>\n</tr>`
  }

  document.getElementById('table-placeholder').style.display = "none";
  document.getElementById('table-container').style.visibility = "visible";

  document.getElementById('how-many-weeks').value = "";
  document.getElementById('users-date').value = "";
  document.getElementById('zipcode').value = "";
  document.getElementById('table-container').scrollIntoView();
}

function PrintDoc() {
  var toPrint = document.getElementById('page-to-print');
  var popupWin = window.open('', '_blank', 'width=900,height=500,location=no,left=200px');
  popupWin.document.open();
  popupWin.document.write("<html><title>::Preview::</title><link rel='stylesheet' href='assets/css/main.css' /><link rel='stylesheet' type='text/css' href='my-css.css' /></head><body onload='window.print()'>")
  popupWin.document.write(toPrint.innerHTML);
  popupWin.document.write('</html>');
  popupWin.document.close();
}

// Allow pressing Enter key to search in addition to clicking search

let zipcode = document.getElementById("zipcode");
zipcode.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("search").click();
  }
});

function addSlashes(event) {
  let dateInput = document.getElementById('users-date')
  if (event.keyCode == 8 || event.keyCode == 46) {
    return
  } else if (dateInput.value.length === 2) {
    let addFirstSlash = dateInput.value += "/"
    dateInput.toString().replace(dateInput.value, addFirstSlash);
  } else if (dateInput.value.length === 5) {
    let addSecondSlash = dateInput.value += "/"
    dateInput.toString().replace(dateInput.value, addSecondSlash);
  }
}

// Function to find first Friday of DST
function findFirstDSTFriday() {
  for (let i = 6; i < 16; i++) {
    if (moment(`March ${i}`, "MMMM D").isDST()) {
      firstMondayOfDst = (moment(`March ${i}`, "MMMM D"))
      break;
    }
  }
  let firstFriOfDst = firstMondayOfDst.endOf('week').subtract(1, 'day').format("L");
  firstDstDay = document.getElementById('first-dst-day')
  firstDstDay.innerHTML = `(first week of DST is ${firstFriOfDst})`
}
// Finds first Friday of DST
// document.addEventListener("DOMContentLoaded", function () {
//   findFirstDSTFriday();
// });

function weeksValidator() {
  let weeks = document.getElementById('how-many-weeks').value
  if (parseInt(weeks) > 0 && parseInt(weeks) < 35) {
    return true
  } else {
    alert("Max weeks is 34")
    return false
  }
}


function dateIsDST(date) {
  let [month, day, year] = date.split("/")
  if (moment(`${year}-${month}-${day}`, "YYYY-MM-DD").isDST()) {
    return true
  }
  false
}

function loopIsOnLastItteration(numOfItterations) {
  if (numOfItterations == document.getElementById('how-many-weeks').value) {
    return true
  }
  false
}

function yomTovFallsOutOnShabbos(dayOne, dayTwo, category, subcategory) {
  shabbos = moment(dayOne).add(1, 'day').format("YYYY-MM-DD")
  if (shabbos === dayTwo && category === "holiday" && subcategory === "major") {
    return true
  }
  false
}

function yomTovDoesntFallOutOnShabbos(category) {
  if (category === "parashat") {
    return true
  }
  false
}