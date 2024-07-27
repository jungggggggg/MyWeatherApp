import { Redirect } from "expo-router";

export default function GoToScreen() {
    return(
        <Redirect href='./(tabs)/WeatherList'/>
    )
}