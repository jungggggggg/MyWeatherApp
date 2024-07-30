import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image } from "react-native";
import { CityListContext } from "../../components/CityManage";

const API_KEY = process.env.OPENWEATHER_API_KEY

export default function CityList() {
    const { cities, setCities } = useContext(CityListContext);
    const [weatherDataList, setWeatherDataList] = useState([]);

    const fetchWeatherData = async (cityName) => {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return null;
        }
    };

    useEffect(() => {
        const fetchAllWeatherData = async () => {
            const weatherDataPromises = cities.map(city => fetchWeatherData(city.name));
            const weatherDataResults = await Promise.all(weatherDataPromises);
            const validWeatherData = weatherDataResults.filter((data, index) => {
                if (data === null) {
                    setCities(prevCities => prevCities.filter(city => city.name !== cities[index].name));
                    return false;
                }
                return true;
            });
            setWeatherDataList(validWeatherData);
        };

        fetchAllWeatherData();
    }, [cities]);

    const renderItem = ({ item, index }) => {
        const weatherData = weatherDataList[index];
        if (!weatherData) return null;
        const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;

        return (
            <View style={styles.item}>
                <Text style={styles.title}>{item.name}</Text>
                <Image source={{ uri: weatherIconUrl }} style={styles.icon} />
                <Text style={styles.weatherText}>Temperature: {weatherData.main.temp}°C</Text>
                <Text style={styles.weatherText}>Weather: {weatherData.weather[0].description}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={cities}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
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
        fontSize: 16,
        color: 'white',
    },
});