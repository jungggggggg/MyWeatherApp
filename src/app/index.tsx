import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import GetWeather from "../component/WeatherAPI";

type weatherDataType = {
    weather:
    {
        main: string;
        icon: string
    },
    main: {
        temp: number;
    }
}

export default function Main() {

    const [data, setData] = useState<weatherDataType>();
    const [loading, setLoading] = useState(true);

    const fetchWeatherData = async () => {
        try {
            const weatherData = await GetWeather();
            setData(weatherData);
        }
        catch (error) {
            return (error);
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchWeatherData();
    }, [])

    return (
        <View style={{ flex: 1 }}>
            {loading ?
                (<Text>Loading.....</Text>)
                :
                (
                    <View>
                        <Text>{data.main.temp}</Text>
                        <Image
                            source={{ uri: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png` }}
                            style={{ width: 100, height: 100 }}
                        />
                    </View>
                )
            }
        </View>
    )
}