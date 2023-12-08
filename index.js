import express  from "express";
import axios from "axios";
import bodyParser from "body-parser";
import session from "express-session";
import * as dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const pathToEnvFile = __dirname + "/api.env"

dotenv.config({ path: pathToEnvFile})
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended:true}));
app.use(session({
    secret: 'zxc0987',
    resave: false,
    saveUninitialized: true
}))


const forecastURL = "http://api.openweathermap.org/data/2.5/forecast?"
const aqiURL = "http://api.openweathermap.org/data/2.5/air_pollution?"
const apiKey = process.env.API_KEY;

app.get("/", async (req, res) => {
    try {
        const defaultLoc = await axios.get("http://api.openweathermap.org/geo/1.0/direct?q=london&limit=5&appid=" + apiKey);
        const city = defaultLoc.data[0].name;
        const lat = defaultLoc.data[0].lat;
        const lon = defaultLoc.data[0].lon;
        const celciusForecast = await axios.get(forecastURL + "lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=metric");
        const fahrenheitForecast = await axios.get (forecastURL + "lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial");
        const aqi = await axios.get(aqiURL + "lat=" + lat + "&lon=" + lon + "&appid=" + apiKey);
        const celciusData = celciusForecast.data.list[0];
        const fahrenheitData = fahrenheitForecast.data.list[0];
        const icon = celciusData.weather[0].icon;
        const statusIcon = "https://openweathermap.org/img/wn/" + icon + ".png";
        const dateFromApi = celciusForecast.data.list[17].dt_txt;
        let date = new Date(dateFromApi);
        let secDate = new Date(celciusForecast.data.list[25].dt_txt);
        let thirdDate = new Date(celciusForecast.data.list[33].dt_txt)
        let dayAfter = date.getDay();
        let fourthDay = secDate.getDay();
        let thirdDay = thirdDate.getDay();
        let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let dayAfterName = weekdays[dayAfter];
        res.render("index.ejs", {
            loc : city,
            humid : celciusData.main.humidity,
            wind : Math.round(celciusData.wind.speed * 3.6),
            aqi : aqi.data.list[0].main.aqi,
            celcTemp : Math.round(celciusData.main.temp),
            status : celciusData.weather[0].main,
            max : Math.round(celciusData.main.temp_max),
            min : Math.round(celciusData.main.temp_min),
            fahrenTemp : Math.round(fahrenheitData.main.temp),
            fahrenStats : fahrenheitData.weather[0].main,
            fahrenMax : Math.round(fahrenheitData.main.temp_max),
            fahrenMin : Math.round(fahrenheitData.main.temp_min),
            statusIcon: statusIcon,
            todayForecastMax : Math.round(celciusForecast.data.list[1].main.temp_max),
            todayForecastMin : Math.round(celciusForecast.data.list[1].main.temp_min),
            tomorrowForecastMax : Math.round(celciusForecast.data.list[9].main.temp_max),
            tomorrowForecastMin : Math.round(celciusForecast.data.list[9].main.temp_min),
            dayAfter : dayAfterName,
            dayAfterMax : Math.round(celciusForecast.data.list[17].main.temp_max),
            dayAfterMin : Math.round(celciusForecast.data.list[17].main.temp_min),
            fourthDay : weekdays[fourthDay],
            fourthDayMax : Math.round(celciusForecast.data.list[25].main.temp_max),
            fourthDayMin : Math.round(celciusForecast.data.list[25].main.temp_min),
            fifthDay : weekdays[thirdDay],
            fifthDayMax : Math.round(celciusForecast.data.list[33].main.temp_max),
            fifthDayMin : Math.round(celciusForecast.data.list[33].main.temp_min),

        })
    } catch (error) {
        res.send(error.message)
    }
})

app.post("/", async (req, res) => {
    try {
        const search = req.body.search;
        const geoURL = "http://api.openweathermap.org/geo/1.0/direct?q=";
        const cityURL = await axios.get(geoURL + search + "&limit=5&appid=" + apiKey)
        const lat = cityURL.data[0].lat;
        const lon = cityURL.data[0].lon;
        const celciusForecast = await axios.get (forecastURL + "lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=metric");
        const fahrenheitForecast = await axios.get (forecastURL + "lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial");
        const aqi = await axios.get(aqiURL + "lat=" + lat + "&lon=" + lon + "&appid=" + apiKey);
        const celciusData = celciusForecast.data.list[0];
        const fahrenheitData = fahrenheitForecast.data.list[0];
        const icon = celciusData.weather[0].icon;
        const statusIcon = "https://openweathermap.org/img/wn/" + icon + ".png";
        const dateFromApi = celciusForecast.data.list[17].dt_txt;
        let date = new Date(dateFromApi);
        let secDate = new Date(celciusForecast.data.list[25].dt_txt);
        let thirdDate = new Date(celciusForecast.data.list[33].dt_txt)
        let dayAfter = date.getDay();
        let fourthDay = secDate.getDay();
        let thirdDay = thirdDate.getDay();
        let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let dayAfterName = weekdays[dayAfter];
        req.session.tempMax = Math.round(celciusForecast.data.list[1].main.temp_max);
        res.render("index.ejs", {
            data : cityURL.data,
            loc : cityURL.data[0].name,
            humid : celciusData.main.humidity,
            wind : Math.round(celciusData.wind.speed * 3.6),
            aqi : aqi.data.list[0].main.aqi,
            celcTemp : Math.round(celciusData.main.temp),
            status : celciusData.weather[0].main,
            max : Math.round(celciusData.main.temp_max),
            min : Math.round(celciusData.main.temp_min),
            fahrenTemp : Math.round(fahrenheitData.main.temp),
            fahrenStats : fahrenheitData.weather[0].main,
            fahrenMax : Math.round(fahrenheitData.main.temp_max),
            fahrenMin : Math.round(fahrenheitData.main.temp_min),
            statusIcon: statusIcon,
            todayForecastMax : Math.round(celciusForecast.data.list[1].main.temp_max),
            todayForecastMin : Math.round(celciusForecast.data.list[1].main.temp_min),
            tomorrowForecastMax : Math.round(celciusForecast.data.list[9].main.temp_max),
            tomorrowForecastMin : Math.round(celciusForecast.data.list[9].main.temp_min),
            dayAfter : dayAfterName,
            dayAfterMax : Math.round(celciusForecast.data.list[17].main.temp_max),
            dayAfterMin : Math.round(celciusForecast.data.list[17].main.temp_min),
            fourthDay : weekdays[fourthDay],
            fourthDayMax : Math.round(celciusForecast.data.list[25].main.temp_max),
            fourthDayMin : Math.round(celciusForecast.data.list[25].main.temp_min),
            fifthDay : weekdays[thirdDay],
            fifthDayMax : Math.round(celciusForecast.data.list[33].main.temp_max),
            fifthDayMin : Math.round(celciusForecast.data.list[33].main.temp_min)
        })
    } catch (error) {
            res.send(error)
        
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

