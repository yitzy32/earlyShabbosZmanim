async function getInputValue() {
  let inputVal = document.getElementById("zipcode").value;
  console.log(inputVal);

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
  for (let index = 0; index < 4; index++) {
    let temporaryDay = {}

    splitDay = thisFridaySlashes.split("/")
    thisFridayDashes += splitDay[2]
    thisFridayDashes += "-"
    thisFridayDashes += splitDay[0]
    thisFridayDashes += "-"
    thisFridayDashes += splitDay[1]

    await axios.get(`https://www.hebcal.com/zmanim?cfg=json&zip=${inputVal}&date=${thisFridayDashes}`)
      .then(function (response) {

        temporaryDay["location"] = response.data.location.name
        temporaryDay["date"] = moment(response.data["date"], "YYYY MM DD").format("LL");
        temporaryDay["minchaGedola"] = moment(response.data["times"]["minchaGedola"], "YYYY-MM-DDTHH:mm:ss").format("h:mm A")
        temporaryDay["earlyMincha"] = moment(response.data["times"]["plagHaMincha"]).subtract(15, "minutes").format('LT')
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
      });
    thisFridayDashes = ""
    thisFridaySlashes = moment(thisFridaySlashes).add(7, "day").format("L")
  }
  console.log(temporaryDays)

  const locationH2 = document.getElementById('locationH2')
  const tableHeadData = document.getElementById('tableHead');
  const tableBody = document.getElementById('tableData')

  let location = '';
  let tbodyHmtl = '';

  for (const day of temporaryDays) {
    tbodyHmtl += `<tr>\n<td id="date-column">${day.date}</td>\n<td>${day.minchaGedola}</td>\n<td>${day.earlyMincha}</td>\n<td>${day.plagHaMincha}</td>\n<td>${day.candleLighting}</td>\n<td>${day.shkia}</td>\n<td>${day.tzeis50min}</td>\n</tr>`
    location = day.location
  }

  locationH2.innerHTML = "Zmanim for: " + location;

  tableHeadData.innerHTML = "<tr><th>Date</th><th>Mincha Gedola</th><th>Early <br>Mincha</th><th>Plag</th><th>Candle Lighting</th><th>Shkia</th><th>Tzeis 50 Minutes</th></tr>";

  tableBody.innerHTML = tbodyHmtl
}

function PrintDoc() {
  var toPrint = document.getElementById('page-to-print');
  var popupWin = window.open('', '_blank', 'width=900,height=500,location=no,left=200px');
  popupWin.document.open();
  popupWin.document.write("<html><title>::Preview::</title><link rel='stylesheet' type='text/css' href='my-css.css' /></head><body onload='window.print()'>")
  popupWin.document.write(toPrint.innerHTML);
  popupWin.document.write('</html>');
  popupWin.document.close();
}