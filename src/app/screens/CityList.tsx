import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity } from "react-native";
import { CityListContext } from "../../components/CityManage";

const API_KEY = process.env.OPENWEATHER_API_KEY;

export default function CityList() {
    const { cities, setCities } = useContext(CityListContext);
    const [weatherDataList, setWeatherDataList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCity, setSelectedCity] = useState(null);
    const [forecastData, setForecastData] = useState([]);

    const fetchWeatherData = async (cityName: string) => {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            const { lat, lon } = data.coord;
            return { lat, lon, ...data };
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const fetchForecastData = async (lat: number, lon: number) => {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const getDailyForecast = (forecastData) => {
        const dailyData = {};
        forecastData.list.forEach(entry => {
            const date = new Date(entry.dt_txt);
            const day = date.toISOString().split('T')[0];
            if (!dailyData[day]) {
                dailyData[day] = {
                    maxTemp: entry.main.temp_max,
                    minTemp: entry.main.temp_min
                };
            } else {
                dailyData[day].maxTemp = Math.max(dailyData[day].maxTemp, entry.main.temp_max);
                dailyData[day].minTemp = Math.min(dailyData[day].minTemp, entry.main.temp_min);
            }
        });

        return Object.keys(dailyData).map(day => ({
            date: day,
            maxTemp: dailyData[day].maxTemp,
            minTemp: dailyData[day].minTemp
        })).slice(0, 7); // 첫 7일만 반환
    };

    const getCityWeatherAndForecast = async (cityName: string) => {
        const weatherData = await fetchWeatherData(cityName);
        if (weatherData) {
            const { lat, lon } = weatherData;
            const forecastData = await fetchForecastData(lat, lon);
            const dailyForecast = getDailyForecast(forecastData);
            setWeatherDataList(prevState => [...prevState, weatherData]);
            setForecastData(dailyForecast);
            setSelectedCity({ name: cityName });
        } else {
            console.error('Failed to fetch weather data');
        }
    };

    useEffect(() => {
        const fetchAllWeatherData = async () => {
            const weatherDataPromises = cities.map(city => fetchWeatherData(city.name));
            const weatherDataResults = await Promise.all(weatherDataPromises);

            const validWeatherData = weatherDataResults.filter(data => data !== null);
            const validCities = cities.filter((city, index) => weatherDataResults[index] !== null);

            setCities(validCities);
            setWeatherDataList(validWeatherData);
            setLoading(false);
        };

        fetchAllWeatherData();
    }, [cities]);

    const renderItem = ({ item, index }) => {
        const weatherData = weatherDataList[index];
        if (!weatherData) return null;
        const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;

        return (
            <TouchableOpacity onPress={() => getCityWeatherAndForecast(item.name)}>
                <View style={styles.item}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Image source={{ uri: weatherIconUrl }} style={{ width: 60, height: 60}} />
                    <Text style={styles.weatherText}>Temperature: {weatherData.main.temp}°C</Text>
                    <Text style={styles.weatherText}>Weather: {weatherData.weather[0].description}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderSelectedCity = () => {
        if (!selectedCity) return null;
        const weatherData = weatherDataList.find(data => data.name === selectedCity.name);
        if (!weatherData) return null;
        const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;

        const Temp = Math.round(weatherData.main.temp);

        return (
            <View style={styles.selectedCityContainer}>
                <Text style={{ fontSize: 20 }}>{selectedCity.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={{ uri: weatherIconUrl }} style={{ width: 100, height: 100 }} />
                    <Text style={{ fontSize: 40 }}>{Temp} °C</Text>
                </View>
                <Text style={{ color: 'black', fontSize: 20 }}>{weatherData.weather[0].description}</Text>
                <TouchableOpacity style={{ position: 'absolute', top: 0, left: 0 }} onPress={() => setSelectedCity(null)}>
                    <Text style={styles.closeButtonText}>Go To List</Text>
                </TouchableOpacity>
                <View style={styles.forecastContainer}>
                    {forecastData.map((forecast, index) => (
                        <View key={index} style={[styles.forecastItem, {flexDirection: 'row'}]}>
                            <Text>{forecast.date}  |  {Math.round(forecast.minTemp)} °C - {Math.round(forecast.maxTemp)} °C</Text>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            ) : selectedCity ? (
                renderSelectedCity()
            ) : (
                <FlatList
                    data={cities}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 20,
        color: 'gray',
    },
    item: {
        backgroundColor: 'gray',
        padding: 10,
        width: 320,
        margin: 10,
        borderRadius: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        color: 'white',
    },
    icon: {
        width: 50,
        height: 50,
        marginVertical: 10,
    },
    weatherText: {
        fontSize: 18,
        color: 'white',
    },
    selectedCityContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
    },
    selectedCityTitle: {
        fontSize: 30,
    },
    closeButton: {},
    closeButtonText: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
    },
    forecastContainer: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 10,
    },
    forecastItem: {
        marginBottom: 10,
    },
});