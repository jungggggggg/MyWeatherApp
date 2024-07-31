import { useContext, useState } from "react"
import { View, Text } from "react-native"
import SearchPage from "./SearchPage";
import CityList from "./CityList";
import React from "react";
import { CityListContext, useTaskManager } from "../../components/CityManage";
import { Button } from "@rneui/base";





const MainPage = () => {

    const { cities } = useContext(CityListContext);

    const [addNewCity, setAddNewCity] = useState(false);

    return (
        <View style={{ flex: 1, }}>
            {cities.length === 0 || addNewCity === true ? (
                <View>
                <SearchPage/>
                <View style={{alignItems: 'center', paddingTop: 653}}>
                    {cities.length === 0 ?
                    (null):
                (<Button title='City List' buttonStyle={{ backgroundColor: 'gray' }} onPress={() => setAddNewCity(false)}/>)
                    }
                </View>
                </View>
            ) : (
                <View style={{flex: 1, alignItems: 'center',}}>
                <CityList />
                <Button buttonStyle={{ backgroundColor: 'gray', marginTop: 10}} title='Add City' onPress={() => setAddNewCity(true)}/>
                </View>
            )
        }
        </View>
    )



}
export default MainPage;