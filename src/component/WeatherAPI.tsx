
const API_KEY = process.env.OPENWEATHER_API_KEY


const GetWeather = async () => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=37.5665&lon=126.9780&appid=${API_KEY}`)
    const data = await response.json()

    console.log(data)
    return data;
}

export default GetWeather;
