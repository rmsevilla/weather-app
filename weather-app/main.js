import "./style.css"
import { getWeather } from "./weather"
import { getCityName } from "./weather"
import { ICON_MAP } from "./iconMap"

navigator.geolocation.getCurrentPosition(positionSuccess, positionError)

function positionSuccess({coords}) {
    getWeather(
        coords.latitude,
        coords.longitude,
        Intl.DateTimeFormat().resolvedOptions().timeZone
    )
    .then(renderWeather)
    .catch(e => {
        console.error(e)
        alert("Error getting weather")
    });

    getCityName(coords.latitude, coords.longitude)
        .then(cityName => {
            setValue("current-city", cityName);
        })
        .catch(e => {
            console.error(e);
            alert("Error getting city name");
        });
}

function positionError() {
    alert(
        "There was an error getting your location. Please allow us to use your location and refresh the page."
    )
}

function renderWeather({current, hourly, daily}) {
    renderCurrentWeather(current)
    renderHourlyWeather(hourly)
    renderDailyWeather(daily)
    document.body.classList.remove("blurred")
}

function setValue(selector, value, {parent = document} = {}) {
    parent.querySelector(`[data-${selector}]`).textContent = value
}

function getIconUrl(iconCode) {
    return `icons/animated-icons/${ICON_MAP.get(iconCode)}.svg`
}

const currentIcon = document.querySelector("[data-current-icon]")
function renderCurrentWeather(current) {
    currentIcon.src = getIconUrl(current.iconCode)
    setValue("current-temp", current.currentTemp)
    setValue("current-high", current.highTemp)
    setValue("current-low", current.lowTemp)
    // setValue("current-fl-high", current.highFeelsLike)
    // setValue("current-fl-low", current.lowFeelsLike)
    // setValue("current-wind", current.windSpeed)
    // setValue("current-precip", current.precip)
}

const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, {hour: "numeric"})
const hourlySection = document.querySelector("[data-hour-section]")
const hourRowTemplate = document.getElementById("hour-row-template")
function renderHourlyWeather(hourly) {
    hourlySection.innerHTML = ""
    const now = new Date().getTime();
    const filteredHourly = hourly.filter((hour) => hour.timestamp >= now && hour.timestamp <= now + 6 * 3600 *1000);
    filteredHourly.forEach(hour => {
        const element = hourRowTemplate.content.cloneNode(true)
        setValue("temp", hour.temp, { parent: element})
        setValue("fl-temp", hour.feelsLike, { parent: element})
        setValue("wind", hour.windSpeed, { parent: element})
        setValue("precip", hour.precip, { parent: element})
        setValue("day", DAY_FORMATTER.format(hour.timestamp), { parent: element})
        setValue("time", HOUR_FORMATTER.format(hour.timestamp), { parent: element})
        element.querySelector("[data-icon").src = getIconUrl(hour.iconCode)
        hourlySection.append(element)
    })
}

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, {weekday: "long"})
const dailySection = document.querySelector("[data-day-section]")
const dayRowTemplate = document.getElementById("day-row-template")
function renderDailyWeather(daily) {
    dailySection.innerHTML = ""
    daily.forEach(day => {
        const element = dayRowTemplate.content.cloneNode(true);
        setValue("date", DAY_FORMATTER.format(day.timestamp), {parent: element})
        setValue("temp-high", day.maxTemp, {parent: element})
        setValue("temp-low", day.lowTemp, {parent: element})
        element.querySelector("[data-icon]").src = getIconUrl(day.iconCode);
        dailySection.appendChild(element)
    })
}