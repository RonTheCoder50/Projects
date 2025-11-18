document.addEventListener("DOMContentLoaded", () => {
    searchFunctionality();
    inputDataAPICall();
    darkMode();

    currentAreaWeather();
    manageLocalDark();
    autoResponse();
    suggestAPIcall();
});

//       <--- auto-search result feature --->
function autoResponse() {
    const inpData = document.getElementById("inp");
    const apiKey = "9a6f88364ecc4ccd982124145250811";
    const bar = document.getElementById("suggestBar");
    

    inpData.addEventListener("input", () => {
        if(inpData.value.trim().length > 0) {
            console.log("input -> ", inpData.value.trim());

            //api suggestion response ->
            const inp = inpData.value.trim();
            const url = `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${inp}`;
             
            autoResponseHelper(url);

            if(bar.classList.contains("hidden")) bar.classList.remove("hidden"); //to show suggestion-bar
        }
    });
}

//autoresponse helper
async function autoResponseHelper(url) {
    const fetchData = await fetch(url);
    const data = await fetchData.json();

    let suggest = 1;
    for(let i=0; i<=4; i++) {
        const city = data[i].name;
        const country = data[i].country;
        if(city && country) {
            document.getElementById(`s${suggest}`).innerText = `${city}, ${country}`; //set city by search suggestions
            console.log(data[i]);
            suggest++;
        }
    }
}

//suggest-bar through api call for to update weather!
function suggestAPIcall() {
    const suggest = document.getElementById("suggestBar");
    const input = document.querySelector("input");

    suggest.addEventListener("click", (e) => {
        const bar = e.target.closest(".bar").textContent.trim();

        //call api updater to update api use through suggestions & turn off suggestPanel
        input.value = bar; //add to input
        suggestDrop();
        fetchCitySuggestions(bar); //now call to api

        setTimeout(() => {
            searchHelper(); //to off the input panel
        }, 500);
    });
}

//turn off suggest panel
function suggestDrop() {
    const suggest = document.getElementById("suggestBar");
    suggest.classList.add("hidden");
}


// <--- Dark Mode --->
function darkMode() {
    const toggler = document.getElementById("toggler");
    const moonIcon = document.getElementById("t-moon");
    const sunIcon = document.getElementById("t-sun");
    

    toggler.addEventListener("click", (e) => {
        if(e.target) { //to perform dark mode operation!
            console.log("dark mode is toggle!");
            darkUpdater();
        }

        moonIcon.classList.toggle("hidden");
        sunIcon.classList.toggle("hidden");

        //now save to local also
        darkSaverLocal();
    });
}

//dark mode class bg-update helper
function darkUpdater() {
    const body = document.querySelector("body");

    const panel_UI1 = document.getElementById("panel_1");
    const panel1_mid = document.getElementById("panel1_mid");
    const panel_UI2 = document.getElementById("panel_2");
    const degree = document.getElementById("deg");
    const footer = document.getElementById("footer");

    body.classList.toggle("bg-gray-100");
    body.classList.toggle("bg-gray-800");

    panel_UI1.classList.toggle("bg-white");
    panel_UI1.classList.toggle("bg-gray-600");
    panel_UI1.classList.toggle("text-white");
            
    panel1_mid.classList.toggle("bg-gray-200");
    panel1_mid.classList.toggle("bg-gray-700/50");
    panel1_mid.classList.toggle("text-white");

    panel_UI2.classList.toggle("bg-white");
    panel_UI2.classList.toggle("bg-gray-600");
    panel_UI2.classList.toggle("text-white");

    degree.classList.toggle("text-gray-800");
    degree.classList.toggle("text-white");

    footer.classList.toggle("border-t");
    footer.classList.toggle("border-white");
    footer.classList.toggle("shadow-md");
}

//local dark supporter to handled dark mode - I
function localDarkUpdate() {
    const body = document.querySelector("body");

    const panel_UI1 = document.getElementById("panel_1");
    const panel1_mid = document.getElementById("panel1_mid");
    const panel_UI2 = document.getElementById("panel_2");
    const degree = document.getElementById("deg");
    const footer = document.getElementById("footer");

    const sun = document.getElementById("t-sun");
    const moon = document.getElementById("t-moon");

    //for icon 
    sun.classList.remove("hidden");
    moon.classList.add("hidden");

    footer.classList.add("border-t");
    footer.classList.add("border-white");
    footer.classList.add("shadow-md");

    body.classList.remove("bg-gray-100");
    body.classList.add("bg-gray-800");

    panel_UI1.classList.remove("bg-white");
    panel_UI1.classList.add("bg-gray-600");
    panel_UI1.classList.add("text-white");
            
    panel1_mid.classList.remove("bg-gray-200");
    panel1_mid.classList.add("bg-gray-700/50");
    panel1_mid.classList.add("text-white");

    panel_UI2.classList.remove("bg-white");
    panel_UI2.classList.add("bg-gray-600");
    panel_UI2.classList.add("text-white");

    degree.classList.remove("text-gray-800");
    degree.classList.add("text-white");
}

//local dark supp - II
function darkSaverLocal() {
    if(document.body.classList.contains("bg-gray-800")) {//dark
        localStorage.setItem("isDark", true);
    } else { //light 
        localStorage.setItem("isDark", false);
    }

    console.log("current body is dark -> ", localStorage);
}

//local dark III
function manageLocalDark() {
    const isDark = localStorage.getItem("isDark") === "true";

    if(isDark) {
        //dark mode is on - but due to refresh it off's
        localDarkUpdate();
    } 
}

// <----- API functionality ----->
function inputDataAPICall() {
    const sBtn = document.getElementById("inpBtn");

    sBtn.addEventListener("click", () => {
        const inpData = document.getElementById("inp");
        const data = inpData.value;

        fetchCitySuggestions(data);
        searchHelper();
    });       
}

//API func helper
async function fetchCitySuggestions(query) {
    console.log("input data -> ", query);
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=9a6f88364ecc4ccd982124145250811&q=${query}`);

        const data = await response.json(); //we access data in json format
        // console.log("data -> ", data);

        console.log("weather condition -> ", data.current);
        console.log("location -> ", data.location);
        console.log("condition -> ", data.current.condition);

        //now functionality
        const currentData = data.current;
        const locationData = data.location;
        // const condition = data.condition;

        updateWeather(currentData, locationData);
    } catch(e) {
        console.log("Error occur -> ", e);
    }

    console.log("API call logged!");
}

//updating weather condition in card
function updateWeather(current, location) {
    console.log("updaing location");

    //update common features
    const city = document.getElementById("city");
    const country = document.getElementById("country");
    const temCelcius = document.getElementById("degree");
    const weatherIcon = document.getElementById("weather-I");

    city.innerText = location.name; //this shows city
    country.innerText = location.country; //this shows country
    temCelcius.innerText = current.temp_c; //sets current temparature
    weatherIcon.setAttribute("src", "https:" + current.condition.icon); //set weather icon through Api

    setAreaTime(location.localtime); //schedule timeline

    //update other weather conditions
    const wind = document.getElementById("panel-W");
    const humidity = document.getElementById("panel-H");
    const uv = document.getElementById("panel-UV");

    wind.innerText = `${current.wind_kph} km/h`;
    humidity.innerText = `${current.humidity}%`;
    uv.innerText = current.uv;

    //send request for previous & future fetch weather data
    fetchPreviousDaysWeather(location.name); //send location to update history/previous weather
    fetchNextDayWeather(location.name); //send location to update forecast weather

    //for understanding
    console.log("current city -> ", location.name);
    console.log("current country -> ", location.country);
    console.log("current location temparature -> ", current.temp_c);
    console.log("current location date/time -> ", location.localtime);
}

//updating current area date/timeline
function setAreaTime(time) {
    time = time.toString();
    const isoTime = time.replace(" ", "T");
    const localTime = new Date(isoTime); //get current time according location

    //now update timeline
    const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const day = localTime.getDay();
    const date = localTime.getDate();
    const year = localTime.getFullYear();

    const updateDate = document.getElementById("date");
    updateDate.innerText = `${date} ${week[day]}, ${year}`;

    console.log("current localtime -> ", updateDate.textContent.trim());
}

//search input bar functionality for toggling input bar
function searchFunctionality() {
    const search = document.getElementById("search");
    const cross = document.getElementById("cross");

    search.addEventListener("click", () => {
        searchHelper(cross, search);
    });

    cross.addEventListener("click", () => {
        suggestDrop(); //off the suggest drop-panel
        searchHelper();
    });
}

function searchHelper() {
    const search = document.getElementById("search");
    const cross = document.getElementById("cross");

    const inp = document.getElementById("inp");
    const topPanel = document.getElementById("top-1");
    const searchBtn = document.getElementById("inpBtn");

    topPanel.classList.toggle("hidden");
    inp.classList.toggle("hidden");
    inp.value = "";

    //symbol change
    cross.classList.toggle("hidden");
    search.classList.toggle("hidden");
    searchBtn.classList.toggle("hidden"); //for city or country search button

    //for keyboard button press!
    document.addEventListener("keydown", (e) => { 
        if(e.key === "Enter" && inp.value != null && document.activeElement === inp) {
            console.log("call goes!");
            fetchCitySuggestions(inp.value); //update weather
            searchHelper(); //hide input
            suggestDrop(); //hide suggestions
        }
    });
}

//current location homepage weather-updating --->
function currentAreaWeather() {
    //access first current location longitude and latitude

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                console.log("current latitude: ", latitude);
                console.log("current longitude: ", longitude);

                //now call for api to access weather conditions
                const url = `https://api.weatherapi.com/v1/current.json?key=9a6f88364ecc4ccd982124145250811&q=${latitude},${longitude}`;

                console.log(url);
                currAreaUpdateHelper(url);
            },
            (error) => {
                console.log("error getting for location -> ", error.message);
            }
        );
    } else {
        console.log("Geolocation is not supported by this browser!");
    }
}

async function currAreaUpdateHelper(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log(data);
        console.log("data -> ", data.current);
        console.log("location -> ", data.location);

        //now update current weather
        updateWeather(data.current, data.location);
    } catch(e) {
        console.log("Error occur -> ", e.message);
    }
}


// <----- fetch past 7days weather condtions & provide it ----->
//temperature with fahrenate

async function fetchPreviousDaysWeather(queryLocation) {
    const apiKey = "9a6f88364ecc4ccd982124145250811";
    const location = queryLocation;

    //now fetch past 7-days weather condition through fetch api
    let day = 1; //for dynamic history help

    for(let i=7; i>=1; i--) { //to get from past/prev 1 to 7 days
        const date = formatDate(i);
        const url = `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${location}&dt=${date}`;
        // console.log("url -> ", url);

        const fetchData = await fetch(url);
        const weatherData = await fetchData.json();

        //functionality
        const prevWeather = weatherData.forecast.forecastday[0].day;

        // console.log(`weather data of previous date ${date} -> -> `, prevWeather);
        updatePrevWeatherHelper(date, prevWeather, prevWeather.condition, day);
        day++;
    }
}

//helper of history-weather updatation
function updatePrevWeatherHelper(date, weather, condition, day) {
    console.log("history weather all status updated!");

    //update history weekday
    const week = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const d = new Date(date);
    console.log("day -> ", week[d.getDay()]);

    //update all 7day block dynamically using id & modify day logic
    const Day = document.getElementById(`day${day}_d`);
    if(Day) Day.innerText = week[d.getDay()];

    const icon = document.getElementById(`day${day}_i`);
    if(icon) icon.setAttribute("src", "https:" + condition.icon);

    const temperature = document.getElementById(`day${day}_t`);
    if(temperature) temperature.innerText = weather.avgtemp_c;

    // console.log(`day${day} of temp in celcius -> ${weather.avgtemp_c}`);

    const fahrenate = document.getElementById(`day${day}_f`);
    if(fahrenate) fahrenate.innerText = weather.avgtemp_f;
    // console.log(`day${day} of temp in faheranite -> ${weather.avgtemp_f}`);
}

// helper of fetchPreviousWeatherData to get date in format YYYY-MM-DD , it converts ISO to get this!
function formatDate(offsetDays) {
    const date = new Date();
    date.setDate(date.getDate() - offsetDays); //update to get previous days

    return date.toISOString().split('T')[0];
}


// <----- fetch forecast next 3days weather conditions & provide for UI panel ----->
async function fetchNextDayWeather(queryLocation) {
    const apiKey = "9a6f88364ecc4ccd982124145250811";
    const location = queryLocation;

    let day = 1;
    
    for(let i=1; i<=3; i++) {
        const date = formatDateNext(i);
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&dt=${date}`;

        console.log("future date -> ", date);

        const fetchData = await fetch(url); //fetching next day weather condtion
        const weatherData = await fetchData.json(); //json format data

        const weather = weatherData.current; //weather data
        const condition = weatherData.current.condition; //weather cond to access icon

        console.log("weather condition -> ", weatherData);
        updateForecastWHelper(day, condition, date, weather);
        day++;
    }
}

//helper of forecast weather updater
function updateForecastWHelper(day, condition, date, weather) {
    //update days of future forecast
    const week = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const dt = new Date(date);

    //update day {mon, tue etc}
    const updateDay = document.getElementById(`fday${day}_d`);
    if(updateDay) updateDay.innerText = week[dt.getDay()];

    //icon update
    const updateIcon = document.getElementById(`fday${day}_i`);
    if(updateIcon) updateIcon.setAttribute("src", `https:${condition.icon}`);

    //update temperature
    const updateTem = document.getElementById(`fday${day}_t`);
    if(updateTem) updateTem.innerText = weather.temp_c;

    //update fahrenate
    const updateFah = document.getElementById(`fday${day}_f`);
    if(updateFah) updateFah.innerText = weather.temp_f;

    console.log(`forecast day ${day} weather condition updated!!!`);
    console.log(`forecast day${day} temperature -> `, weather.temp_c);
    console.log(`forecast day${day} fahrenate -> `, weather.temp_f);
    
}

//forecast days date formatter
function formatDateNext(days) {
    const date = new Date();
    date.setDate(date.getDate() + days); //update to get previous days

    return date.toISOString().split('T')[0];
}