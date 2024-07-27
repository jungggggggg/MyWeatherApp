
const API_KEY = process.env.OPENWEATHER_API_KEY


const GetWeather = async () => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=London&lang=eng&units=metric&appid=${API_KEY}`)
    const data = await response.json()

    return data;
}

export default GetWeather;
