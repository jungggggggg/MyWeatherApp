import { useContext } from "react";
import { CityListContext } from "./CityManage";

const apiKey = process.env.OPENWEATHER_API_KEY

const { cities } = useContext(CityListContext);

const cityName = cities[0].name
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });