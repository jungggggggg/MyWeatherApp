import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export type City = {
    id: string;
    name: string;
}

type CityListContextType = {
    cities: City[];
    setCities: React.Dispatch<React.SetStateAction<City[]>>
    addCity: (cityName: string) => void;
}

export const CityListContext = createContext<CityListContextType>({
    cities: [],
    setCities: () => {},
    addCity: () => {},
});

export const useTaskManager = () => {
    const context = useContext(CityListContext);
    if (!context) {
        throw new Error('useTaskManager must be used within a TaskManagerProvider');
    }
    return context;
}

const TaskManagerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cities, setCities] = useState<City[]>([]);

    const addCity = (cityName: string) => {
        if (cities.some(city => city.name === cityName)) {
            return;
        } else {
        setCities(prevCities => [...prevCities, { id: Date.now().toString(), name: cityName,}]);
    }
    };

    useEffect(() => {
    }, [cities]);

    return (
        <CityListContext.Provider value={{ addCity, cities, setCities }}>
            { children }
        </CityListContext.Provider>
    )

}
export default TaskManagerProvider;