export const ICON_MAP = new Map()

addMapping([0, 1], "clear-day")
addMapping([2], "partly-cloudy-day")
addMapping([3], "cloudy")
addMapping([45, 48], "smog")
addMapping([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82], 
    "rain"
)
addMapping([71, 73, 75, 77, 85, 86], "snow")
addMapping([95, 96, 99], "thunderstorms")



function addMapping(values, icon) {
    values.forEach(value => {
        ICON_MAP.set(value, icon)
    })
}
