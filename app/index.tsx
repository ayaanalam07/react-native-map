// import { Text, View } from "react-native";

// export default function Index() {
//   return (
//     <View
//       className="flex-1 justify-center items-center"
//     >
//       <Text className="text-center bg-red-400 p-[2rem]">Edit app/index.tsx to edit this screen.</Text>
//     </View>
//   );
// }




import { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

interface SinglePlace {
  latitude: number;
  longitude: number
}

interface AllPlaces {
  fsq_id: string;
  name: string
}

export default function App() {
  const [location, setLocation] = useState<null | any>(null);
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [search, setSearch] = useState('')
  const [places , setPlaces] = useState<null | AllPlaces[]>(null);
  const [singlesearchPlace , setsinglesearchPlace] = useState<null| SinglePlace>(null);

  useEffect(() => {
    (async () => {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location);

    })();
  }, []);

  // function hello(){
  //   console.log('hello world')
  // }
  // hello()

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  // search places

  const searchPlaces = () => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'fsq3qbL9ORBTq2ZaS6TUHxpAQZNDJjTlkT2lBeAynwmhZ8I='
      }
    };

    fetch(`https://api.foursquare.com/v3/places/search?query=${search}&ll=${location.coords.latitude}%2C${location.coords.longitude}&radius=100000`, options)


      .then(res => res.json())
      .then(res => {
        console.log(res.results)
        setPlaces(res.results)
      })
      .catch(err => console.error(err));
    console.log(search)
  }

  // single place

  const singlePlace = (item: any)=>{
    setPlaces(null);
    setsinglesearchPlace({
      latitude: item.geocodes.main.latitude,
      longitude: item.geocodes.main.longitude
    })

  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.paragraph}>{text}</Text> */}
      <TextInput
        style={styles.input}
        onChangeText={setSearch}
        value={search}
        placeholder="search"
      />
       {places && <FlatList
         data={places}
         renderItem={({item}: {item: {name: string}}) => {
          return <View style={styles.list}>
            <Text onPress={()=>singlePlace(item)}>{item.name}</Text>
          </View>
         }}
         keyExtractor={(item:{fsq_id: string}) => item.fsq_id
         }
        />}
      <TouchableOpacity onPress={searchPlaces} style={styles.button}>
        <Text>Search</Text>
      </TouchableOpacity>
     
      {location && <MapView style={styles.map} initialRegion={{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0001,
        longitudeDelta: 0.0001,
      }}>
        <Marker coordinate={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }} />
        {singlesearchPlace && <Marker coordinate={{
          latitude: singlesearchPlace.latitude,
          longitude: singlesearchPlace.longitude,
        }} />}

      </MapView>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
  map: {
    width: '100%',
    height: '50%',
  },
  input: {
    height: 40,
    width: 180,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
  list: {
    backgroundColor: 'gray',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    padding: 5,
    width: 280
  }
});