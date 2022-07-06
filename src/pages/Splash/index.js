import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import data from '../../DATA/data.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Splash({navigation}) {
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('biodata');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  // const biodataLength = Object.keys(data.biodata).length;
  useEffect(() => {
    setTimeout(() => {
      getData().then(value => {
        if (value !== null) {
          navigation.replace('HomeScreen');
        } else {
          navigation.replace('SignupScreen');
        }
      });
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Splash</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    justifyContent: 'center',
  },
});
