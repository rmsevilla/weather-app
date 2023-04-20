import "./style.css"
import { getWeather } from "./weather"
import { ICON_MAP } from "./iconMap"

getWeather(10, 10, Intl.DateTimeFormat().resolvedOptions().timeZone)
    .then(renderWeather)
    .catch(e => {
        console.error(e)
        alert("Error getting weather.")
    })

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
    hourly.forEach(hour => {
        const element = hourRowTemplate.content.cloneNode(true)
        setValue("temp", hour.temp, { parent: element})
        setValue("fl-temp", hour.feelsLike, { parent: element})
        setValue("wind", hour.windSpeed, { parent: element})
        setValue("precip", hour.precip, { parent: element})
        setValue("day", DAY_FORTMATTER.format(hour.timestamp), { parent: element})
        setValue("time", HOUR_FORMATTER.format(hour.timestamp), { parent: element})
        element.querySelector("[data-icon").src = getIconUrl(hour.iconCode)
        hourlySection.append(element)
    })
}
