import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Text, Image, StyleSheet, Alert } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Select from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
    const navigation = useNavigation();

    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');

    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    useEffect(() => {
      axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(res => {
       // const ufInitials = res.data.map(uf => uf.sigla);
        const ufInitials = res.data.map(uf => uf.sigla);
  
        setUfs(ufInitials);
      });
    }, []);

    useEffect(() => {
      if(selectedUf === '0') {
        return;
      }
  
      axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(res => {
        const cityNames = res.data.map(city => city.nome);
  
        setCities(cityNames);
      });
    }, [selectedUf]);

    function handleNavigateToPoints() {
      
      console.log({'uf':selectedUf, 'city': selectedCity});
      if(selectedUf === '' || selectedUf === '0') {
        Alert.alert('Opss...', 'selecione um estado pra continuar');
        return;
      } else if(selectedCity === '0' || selectedCity === null ) {        
        Alert.alert('Opss...', 'selecione uma cidade pra continuar');
        return;
      } else {
        navigation.navigate('Points', {uf: selectedUf, city: selectedCity});
      }

    }

    return (
      <ImageBackground 
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{width: 274, height: 368}}
      > 
        <View style={styles.main}> 
          <Image source={require('../../assets/logo.png')} />
          <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
          <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
        </View>

        <View style={styles.input}>
          <Select
            placeholder={{
              label: 'Selecione um estado',
              value: '0',
            }}
            value={selectedUf}
            onValueChange={value => setSelectedUf(value)}
            items={ufs.map(uf => {
              return {
                label: uf,
                value: uf,
              }
            })}
          />
        </View>
        
        <View style={styles.input}>
          <Select
            placeholder={{
              label: 'Selecione uma cidade',
              value: null,
            }}
            value={selectedCity}
            onValueChange={value => setSelectedCity(value)}
            items={cities.map(city => {
              return {
                label: city,
                value: city,
              }
            })}
          />
        </View>

        <View style={styles.footer}>
          <RectButton style={styles.button} onPress={() => {handleNavigateToPoints();}}>
            <View style={styles.buttonIcon}>
              <Text >
                <Icon name="arrow-right" color="#fff" size={24} />
              </Text>
            </View>

            <Text style={styles.buttonText}> Entrar </Text>
          </RectButton>
        </View>
      </ImageBackground>    
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
      backgroundColor:"#f0f0f5"
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

export default Home;
