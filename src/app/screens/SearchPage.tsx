import { SearchBar } from '@rneui/themed';
import { useContext, useState } from 'react';
import { View } from 'react-native';
import { CityListContext, useTaskManager } from '../../components/CityManage';


export default function SearchPage() {

  const { addCity } = useTaskManager();

  const [search, setSearch] = useState('');

  const updateSearch = (search : string) => {
      addCity(search);
      setSearch('');
  }

  return (
    <View>
      <SearchBar
      placeholder='Find cities to search weather...'
      onChangeText={setSearch}
      value={search}
      containerStyle={{ backgroundColor: 'white', borderWidth: 1, borderRadius: 30 }}
      inputContainerStyle={{ backgroundColor: 'white',}}
      inputStyle={{backgroundColor: 'white',}}
      onSubmitEditing={() => updateSearch(search)}
      />
    </View>
  )
}