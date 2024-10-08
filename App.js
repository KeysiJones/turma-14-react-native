import { StatusBar } from 'expo-status-bar';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View, Platform, Pressable } from 'react-native';
import axios from "axios";
import { useEffect, useState } from 'react';
import Botao from './components/Botao';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './routes/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const setUserName = () => AsyncStorage.setItem('nomeDoUsuario', 'Jones')
  const userName = AsyncStorage.getItem('nomeDoUsuario')

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Homepage} />
        <Stack.Screen name="Detalhes" component={Detalhes} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Homepage = ({ navigation, route }) => {
  const [ imageList, setImageList ] = useState([]);
  const [ corDeFundo, setCorDeFundo ] = useState('red');

  useEffect(() => {
    axios.get('https://picsum.photos/v2/list?limit=10').then((response) => {
      setImageList(response.data)
    })
  }, [])

  return (
    <SafeAreaView style={{ display: 'flex', flex: 1 }}>
      <View style={styles.container}>
        <ScrollView style={{ display: 'flex', flex: 1, height: '100%' }}>
          <Botao
            title='Trocar de cor'
            corDeFundo={corDeFundo}
            onPress={() =>
              setCorDeFundo((corDeFundo) =>
                corDeFundo === 'purple' ? 'green' : 'purple'
              )
            }
          />
          <View style={{ rowGap: 10 }}>
            {imageList.map((image) => {
              return (
                <Pressable
                  onPress={() =>
                    navigation.navigate('Detalhes', { imageId: image.id })
                  }
                >
                  <Image
                    style={{ borderRadius: '10px' }}
                    key={image.id}
                    height={Platform.OS === 'ios' ? 300 : 400}
                    width={330}
                    source={{ uri: image.download_url }}
                  />
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
        <StatusBar style='auto' />
      </View>
    </SafeAreaView>
  );
}

const Detalhes = ({ route, navigation }) => {
  const [ image, setImage ] = useState({});

  useEffect(() => {
    axios.get(`https://picsum.photos/id/${route.params.imageId}/info`).then((response) => {
      setImage(response.data)
    })
  }, [])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
      <Image
        key={image.id}
        height={Platform.OS === 'ios' ? 300 : 400}
        width={330}
        style={styles.image}
        source={{ uri: image.download_url }}
      />
      <Text style={styles.imageAuthor}>Author: {image.author}</Text>
      <Botao
        corDeFundo='purple'
        title='Ir para página inicial'
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    borderRadius: '10px',
  },
  imageAuthor: {
    fontSize: 18,
  },
});
