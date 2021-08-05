async function getInputValue() {
  let inputVal = document.getElementById("zipcode").value;
  console.log(inputVal);
  let thisFridaySlashes = moment().endOf('week').subtract(1, 'day').format("L");
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

  let tableData = temporaryDays;
  const tableBody = document.getElementById('tableData')
  let dataHmtl = '';

  for (const day of tableData) {
    dataHmtl += `<tr>\n<td>${day.date}</td>\n<td>${day.minchaGedola}</td>\n<td>${day.earlyMincha}</td>\n<td>${day.plagHaMincha}</td>\n<td>${day.candleLighting}</td>\n<td>${day.shkia}</td>\n<td>${day.tzeis50min}</td>\n</tr>`
  }

  tableBody.innerHTML = dataHmtl

}






// async function getInputValue() {​

//     let inputVal = document.getElementById("zipcode").value;

//     console.log(inputVal);

//     let thisFridaySlashes = moment().endOf('week').subtract(1, 'day').format("L");

//     let thisFridayDashes = ""

//     let temporaryDays = []



//     for (let index = 0; index < 30; index++) {​

//     let temporaryDay = {​}​



//     splitDay = thisFridaySlashes.split("/")

//     thisFridayDashes += splitDay[2]

//     thisFridayDashes += "-"

//     thisFridayDashes += splitDay[0]

//     thisFridayDashes += "-"

//     thisFridayDashes += splitDay[1]



//     await axios.get(`https://www.hebcal.com/zmanim?cfg=json&zip=${​inputVal}​&date=${​thisFridayDashes}​`)

//     .then(function (response) {​



//     temporaryDay["location"] = response.data.location.name

//     temporaryDay["date"] = moment(response.data["date"], "YYYY MM DD").format("LL");

//     temporaryDay["minchaGedola"] = moment(response.data["times"]["minchaGedola"], "YYYY-MM-DDTHH:mm:ss").format("h:mm A")

//     temporaryDay["plagHaMincha"] = moment(response.data["times"]["plagHaMincha"], "YYYY-MM-DDTHH:mm:ss").format("h:mm A")

//     temporaryDay["shkia"] = moment(response.data["times"]["sunset"], "YYYY-MM-DDTHH:mm:ss").format("h:mm A")

//     temporaryDay["tzeis50min"] = moment(response.data["times"]["tzeit50min"], "YYYY-MM-DDTHH:mm:ss").format("h:mm A")

//     temporaryDay["earlyMincha"] = moment(response.data["times"]["plagHaMincha"]).subtract(15, "minutes").format('LT')

//     temporaryDay["candleLighting"] = moment(response.data["times"]["sunset"]).subtract(18, "minutes").format('LT')

//     console.log(temporaryDay)

//     temporaryDays.push(temporaryDay)

//     }​)

//     .catch(function (error) {​

//     console.log(error.response.data.error);

//     console.log(error.response.status);

//     alert(error.response.data.error);

//     }​);

//     thisFridayDashes = ""

//     thisFridaySlashes = moment(thisFridaySlashes).add(7, "day").format("L")

//     }​

//     console.log(temporaryDays)



//     // TABLE GOES HERE

//     const location = document.getElementById('locationH4')

//     const tableHeadData = document.getElementById('tableHead')

//     const tableBody = document.getElementById('tableBody');

//     let tableHeadHtml = `<tr><th>Date</th><th>Mincha Gedola</th><th>Early Mincha</th><th>Plag</th><th>Candle Lighting</th><th>Shkia</th><th>Tzeis 50 Minutes</th></tr>`

//     let tableBodyHtml = '';

//     let h2Html = ''

//     for (const day of temporaryDays) {​

//     tableBodyHtml += `<tr>\n<td>Friday, ${​day.date}​</td>\n<td>${​day.minchaGedola}​</td>\n<td>${​day.earlyMincha}​</td>\n<td>${​day.plagHaMincha}​</td>\n<td>${​day.candleLighting}​</td>\n<td>${​day.shkia}​</td>\n<td>${​day.tzeis50min}​</td>\n</tr>`

//     h2Html = `Zmanim for: ${​day.location}​`

//     }​

//     console.log(tableBodyHtml)

//     location.innerHTML = h2Html

//     tableHeadData.innerHTML = tableHeadHtml

//     tableBody.innerHTML = tableBodyHtml

//     }​


 // ---------------- What I did ----------------



// fixed indentation (index.js/html) and changed legibleShkia to shkia



// moved temporaryDay inside loop.



// refactor code by getting rid of extra variables and console log



// Made stuff show up!!! check out https://www.youtube.com/watch?v=ri5Nqe_IK50



// Made <thead> dynamicly generated too



// make h4 with location



// rename variables in table







//     <!DOCTYPE html>

//     <html lang="en">



//     <head>

//     <meta charset="UTF-8">

//     <meta http-equiv="X-UA-Compatible" content="IE=edge">

//     <meta name="viewport" content="width=device-width, initial-scale=1.0">

//     <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

//     <script src="https://momentjs.com/downloads/moment.js"></script>

//     <script src="index.js" defer></script>

//     <title>Document</title>

//     <style>

//     /* first half of video */

//     body {​

//     font-family: arial, sans-serif;

//     }​

//     table {​

//     font-family: arial, sans-serif;

//     border-collapse: collapse;

//     width: 100%

//     }​

//     td, th {​

//     border: 1px solid #cccccc;

//     padding: 10px;

//     }​

//     th {​

//     font-weight: bold;

//     text-transform: capitalize;

//     }​

//     /* second half of video */



//     tr:nth-child(even) {​

//     background-color: #dddddd;

//     }​



//     /* My own added css */

//     h2 {​

//     text-align: center;

//     }​



//     </style>

//     </head>



//     <body>

//     <p>

//     <label for="zipcode">Please Enter Zipcode</label>

//     </p>

//     <p>

//     <input type="text" placeholder="Type " name="zipcode" id="zipcode">

//     </p>

//     <p>

//     <button type="button" onclick="getInputValue();">Search</button>

//     </p>

//     <h2 id="locationH4"></h2>

//     <table>

//     <thead id="tableHead"></thead>

//     <tbody id="tableBody"></tbody>

//     </table>

//     </body>



//     </html>