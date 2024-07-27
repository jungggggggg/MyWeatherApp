import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, KeyboardAvoidingView, TextInput, TouchableOpacity } from "react-native";
import GetWeather from "../../component/WeatherAPI";
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";

type weatherDataType = {
    weather:
    {
        main: string;
        icon: string;
        description: string;
    },
    main: {
        temp: number;
        temp_min: number;
        temp_max: number;

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

    const [isPress, setIsPress] = useState(false);

    const pressSearch = () => {
        return (
            <TextInput placeholder="Search Location..." />
        )
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1, alignItems: 'center', }}>
            {/* <TouchableOpacity style={{ position: 'absolute', top: 10, right: 15 }} onPress={() => pressSearch()}>
                <AntDesign name="search1" size={24} color="black" />
            </TouchableOpacity> */}
            <SafeAreaView>
                <ScrollView contentContainerStyle={{ flex: 1, alignItems: 'center', paddingRight: 10 }}>
                    {loading ?
                        (<Text>Loading.....</Text>)
                        :
                        (
                            <>
                                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                    <Image
                                        source={{ uri: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png` }}
                                        style={{ width: 120, height: 120 }}
                                    />
                                    <Text style={{ fontSize: 50 }}>{Math.round(data.main.temp)}°</Text>
                                </View>
                                <Text style={{ fontWeight: 'bold', fontSize: 20, paddingBottom: 5 }}>Weather: {data.weather[0].description}</Text>
                                <Text>Max Temp: {Math.round(data.main.temp_max)}°   Min Temp: {Math.round(data.main.temp_min)}°</Text>
                            </>
                        )
                    }
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}