const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchform]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//  variable needed 
let oldTab = userTab;
const API_key = "4937228569ab1fe880e33646e59fdd96";
oldTab.classList.add("current-tab");
getFromSessionStorage();

function switchTab(newTab) {
    if (newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            // kya search form wala conatiner is invisible if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");

        }

        else { // maii pahle search wale tab par tha ab yourb weather tab visible karna haii
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // ab maii you weather tab me aa gya hu toh weather bhii display karna hoga ,so let's check local storage first
            // for coordinates if we have saved them there.
            getFromSessionStorage();


        }
    }
}



userTab.addEventListener("click", () => {
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
})

//checks if coordinates are already present in sssion
function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantAccessContainer.classList.add("active");
    }

    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;

    //make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");

    // API call 
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (err) {
        loadingScreen.classList.remove("active");
        console.error("Error fetching weather data:", err);
        alert("Failed to retrieve weather data. Please try again later.");
    }
}


function renderWeatherInfo(weatherInfo) {
    //  firstly we have to fetch the lelement

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]")
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");


    // fetch values from weather info object 
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp}°C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = ` ${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert(`Error in fetching location: ${error.message}`);
    }
}
function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);


const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if (cityName === "") return;
    else fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }


    catch (err) {
        loadingScreen.classList.remove("active");
        console.error("Error fetching city weather data:", err);
        alert("Failed to retrieve weather data for the specified city. Please check the city name and try again.");
    }

}