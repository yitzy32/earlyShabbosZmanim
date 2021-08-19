async function getInputValue() {

  let howManyWeeks = document.getElementById("how-many-weeks").value;
  let howManyMinsBeforePlag = document.getElementById('mins-before-plag').value;
  let inputVal = document.getElementById("zipcode").value;
  let usersDate = document.getElementById("users-date").value;
  console.log(usersDate)

  // Finds First Monday of Daylight Savings Time of current year
  for (let i = 6; i < 16; i++) {
    if (moment(`March ${i}`, "MMMM D").isDST()) {
      firstMondayOfDst = (moment(`March ${i}`, "MMMM D"))
      break;
    }
  }

  let thisFridaySlashes = firstMondayOfDst.endOf('week').subtract(1, 'day').format("L");
  let thisFridayDashes = ""

  let temporaryDays = []
  for (let index = 0; index < parseInt(howManyWeeks); index++) {
    let temporaryDay = {}

    dayArray = thisFridaySlashes.split("/")
    let month = dayArray[0]
    let day = dayArray[1]
    let year = dayArray[2]
    thisFridayDashes += year
    thisFridayDashes += "-"
    thisFridayDashes += month
    thisFridayDashes += "-"
    thisFridayDashes += day

    await axios.get(`https://www.hebcal.com/zmanim?cfg=json&zip=${inputVal}&date=${thisFridayDashes}`)
      .then(function (response) {

        temporaryDay["location"] = response.data.location.name
        temporaryDay["date"] = moment(response.data["date"], "YYYY MM DD").format("LL");
        temporaryDay["minchaGedola"] = moment(response.data["times"]["minchaGedola"], "YYYY-MM-DDTHH:mm:ss").format("h:mm A")
        temporaryDay["earlyMincha"] = moment(response.data["times"]["plagHaMincha"]).subtract(parseInt(howManyMinsBeforePlag), "minutes").format('LT')
        temporaryDay["plagHaMincha"] = moment(response.data["times"]["plagHaMincha"], "YYYY-MM-DDTHH:mm:ss").format("h:mm A")
        temporaryDay["candleLighting"] = moment(response.data["times"]["sunset"]).subtract(18, "minutes").format('LT')
        temporaryDay["shkia"] = moment(response.data["times"]["sunset"], "YYYY-MM-DDTHH:mm:ss").format("h:mm A")
        temporaryDay["tzeis50min"] = moment(response.data["times"]["tzeit50min"], "YYYY-MM-DDTHH:mm:ss").format("h:mm A")
        console.log(temporaryDay)
        temporaryDays.push(temporaryDay)
      })
      .catch(function (error) {
        console.log(error.response.data.error);
        console.log(error.response.status);
        alert(error.response.data.error);
        window.location.reload();
      });
    thisFridayDashes = ""

    // This line gets rid of deprecation warning discussed: https://github.com/moment/moment/issues/1407
    thisFridaySlashes = moment(`${year} ${month} ${day}`, "YYYY MM DD");
    thisFridaySlashes = moment(thisFridaySlashes).add(7, "day").format("L")
  }
  console.log(temporaryDays)

  const locationH2 = document.getElementById('locationH2')
  const tableHeadData = document.getElementById('tableHead');
  const tableBody = document.getElementById('tableData')
  const disclaimer = document.getElementById('disclaimer')

  let location = '';
  let tbodyHmtl = '';

  for (const day of temporaryDays) {
    tbodyHmtl += `<tr>\n<td id="date-column">${day.date}</td>\n<td>${day.minchaGedola}</td>\n<td>${day.earlyMincha}</td>\n<td>${day.plagHaMincha}</td>\n<td>${day.candleLighting}</td>\n<td>${day.shkia}</td>\n<td>${day.tzeis50min}</td>\n</tr>`
    location = day.location
  }

  locationH2.innerHTML = "Zmanim for: " + location;

  tableHeadData.innerHTML = "<tr><th>Date</th><th>Mincha Gedola</th><th>Early Mincha</th><th>Plag</th><th>Candle Lighting</th><th>Shkia</th><th>Tzeis 50 Minutes</th></tr>";

  tableBody.innerHTML = tbodyHmtl

  disclaimer.innerHTML = "These times are rounded to the nearest minute. Do not rely on any zman until the last moment.<br /> Double check the accuracy of your new zmanim calendar by visiting <a href=https://www.myzmanim.com/day.aspx?askdefault=1&vars=US" + inputVal + " target='_blank'>MyZmanim</a>"

  document.getElementById('table-placeholder').style.display = "none";
  document.getElementById('table-container').style.visibility = "visible";
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

let inputVal = document.getElementById("zipcode");
inputVal.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("search").click();
  }
});