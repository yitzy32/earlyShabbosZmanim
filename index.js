async function generateCalendar() {

  if (!weeksValidator()) return

  let usersDate = moment(document.getElementById('users-date').value)
  let howManyMinsAfterShkia = document.getElementById("mins-after-shkia").value;
  let howManyWeeks = document.getElementById("how-many-weeks").value;
  let minchaBizmanMinutes = document.getElementById("mincha-bizman-minutes").value;
  let howManyMinsBeforePlag = document.getElementById('mins-before-plag').value;
  let zipcode = document.getElementById("zipcode").value;

  let thisFridayDashes = "";
  let thisFridaySlashes = usersDate.endOf('week').subtract(1, 'day').format("L");
  console.log(thisFridaySlashes)

  let temporaryDays = []
  for (let index = 0; index < parseInt(howManyWeeks); index++) {
    let temporaryDay = {}

    let arrayOfDay = thisFridaySlashes.split("/")
    let month = arrayOfDay[0]
    let day = arrayOfDay[1]
    let year = arrayOfDay[2]
    thisFridayDashes += year
    thisFridayDashes += "-"
    thisFridayDashes += month
    thisFridayDashes += "-"
    thisFridayDashes += day
    console.log("thisFridayDashes:", thisFridayDashes)

    await axios.get(`https://www.hebcal.com/zmanim?cfg=json&zip=${zipcode}&date=${thisFridayDashes}`)
      .then(function (response) {

        temporaryDay["location"] = response.data.location.name
        temporaryDay["date"] = moment(response.data["date"], "YYYY MM DD").format("LL");
        temporaryDay["minchaGedola"] = moment(response.data["times"]["minchaGedola"], "YYYY-MM-DDTHH:mm:ss").format("h:mm A")
        temporaryDay["earlyMincha"] = moment(response.data["times"]["plagHaMincha"]).subtract(parseInt(howManyMinsBeforePlag), "minutes").format('LT')
        temporaryDay["plagHaMincha"] = moment(response.data["times"]["plagHaMincha"], "YYYY-MM-DDTHH:mm:ss").format("h:mm A")
        temporaryDay["candleLighting"] = moment(response.data["times"]["sunset"]).subtract(18, "minutes").format('LT')
        temporaryDay["minchaBizman"] = moment(temporaryDay["candleLighting"], "HH:mm A").add(minchaBizmanMinutes, "minutes").format('LT')
        console.log(temporaryDay['minchaBizman'])
        temporaryDay["shkia"] = moment(response.data["times"]["sunset"], "YYYY-MM-DDTHH:mm:ss").format("h:mm A")
        temporaryDay["tzeis"] = moment(response.data["times"]["sunset"]).add(parseInt(howManyMinsAfterShkia), "minutes").format('LT')
        console.log(temporaryDay)
        temporaryDays.push(temporaryDay)
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
    thisFridayDashes = ""

    // This line gets rid of deprecation warning discussed: https://github.com/moment/moment/issues/1407
    thisFridaySlashes = moment(`${year} ${month} ${day}`, "YYYY MM DD");
    thisFridaySlashes = moment(thisFridaySlashes).add(7, "day").format("L")

    axios.get(`https://www.hebcal.com/shabbat?cfg=json&zip=${zipcode}&m=50&a=on&gy=${year}&gm=${month}&gd=${day}`).then(response => {
      const info = response.data.items
      findParsha(info)
    })
  }
  console.log(temporaryDays)

  const locationH2 = document.getElementById('locationH2')
  const tableHeadData = document.getElementById('tableHead');
  const tableBody = document.getElementById('tableData')
  const disclaimer = document.getElementById('disclaimer')

  let location = '';
  let tbodyHmtl = '';

  for (const day of temporaryDays) {
    tbodyHmtl += `<tr>\n<td id="date-column">${day.date}</td>\n<td>${day.minchaGedola}</td>\n<td>${day.earlyMincha}</td>\n<td>${day.plagHaMincha}</td>\n<td class='candle-lighing'>${day.candleLighting}</td>\n<td>${day.minchaBizman}</td>\n<td>${day.shkia}</td>\n<td>${day.tzeis}</td>\n</tr>`
    location = day.location
  }

  locationH2.innerHTML = "Zmanim for: " + location;

  tableHeadData.innerHTML = "<tr><th>Date</th><th>Mincha Gedola</th><th>Early Mincha</th><th>Plag</th><th class='candle-lighing'>Candle Lighting</th><th>Mincha B'zman</th><th>Shkia</th><th>Tzeis <span id='users-tzeis'></span> Minutes</th></tr>";

  document.getElementById("users-tzeis").innerHTML = howManyMinsAfterShkia;

  tableBody.innerHTML = tbodyHmtl

  disclaimer.innerHTML = "These times are rounded to the nearest minute. Do not rely on any zman until the last moment.<br /> Double check the accuracy of your new zmanim calendar by visiting <a href=https://www.myzmanim.com/day.aspx?askdefault=1&vars=US" + zipcode + " target='_blank'>MyZmanim</a>"

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

// Allows user to enter start date. js adds slashes
// Validates day and month format
function usersDate(event) {
  let dateInput = document.getElementById('users-date')
  let dateInputVal = dateInput.value
  let splitDateInputVal = dateInputVal.split("/")
  let month = splitDateInputVal[0]
  let day = splitDateInputVal[1]
  let months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
  let days = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"]
  if (event.keyCode == 8 || event.keyCode == 46) {
    return
  } else if (dateInput.value.length === 2) {
    let addFirstSlash = dateInput.value += "/"
    dateInput.toString().replace(dateInput.value, addFirstSlash);
  } else if (dateInput.value.length === 5) {
    let addSecondSlash = dateInput.value += "/"
    dateInput.toString().replace(dateInput.value, addSecondSlash);
  } else if (dateInput.value.length === 10 && months.includes(month) && days.includes(day) && dateInputVal[2] === "/" && dateInputVal[5] === "/") {
    // This doesn't actually allow or stop anything yet
    return true
  } else {
    return false
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

function findParsha(arrayOfInfo) {
  arrayOfInfo.forEach(e => {
    // console.log(arrayOfInfo)
    if (e.category === "parashat") {
      console.log(e.hebrew)
    }
  });
}
