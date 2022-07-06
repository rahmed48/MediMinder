import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {ILSignup} from '../../assets';
import {colors, fonts} from '../../utils';
import {Gap} from '../../components';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Signup({navigation}) {
  const [nama, setNama] = useState();
  const [noRM, setNoRM] = useState();

  const [date, setDate] = useState(new Date(Date.now()));
  const [opacity, setOpacity] = useState(0.5);
  // console.log(date.toLocaleDateString());
  // console.log(date.toLocaleTimeString());

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    setOpacity(1);
  };

  const showMode = currentMode => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const storeData = async () => {
    try {
      if (nama !== '' && noRM !== '' && date !== '') {
        const jsonValue = JSON.stringify({
          nama: nama,
          noRM: noRM,
          tanggal: date.toLocaleDateString(),
        });
        await AsyncStorage.setItem('biodata', jsonValue);
        await navigation.navigate('HomeScreen');
      } else {
        Alert.alert(
          'Data Tidak Lengkap',
          'Mohon Isi Biodata Anda Dengan Lengkap',
        );
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <Image source={ILSignup} style={styles.image} />
        <Gap height={20} />
        <Text style={styles.titleScreen}>Masukkan Identitas</Text>
        <Gap height={20} />
        <View style={styles.inputContainer}>
          <Text style={styles.inpuTitle}>Nama</Text>
          <TextInput
            style={styles.input}
            placeholder="Isi Nama Lengkap Kamu Disini"
            onChangeText={text => setNama(text)}
          />
        </View>
        <Gap height={20} />
        <View style={styles.inputContainer}>
          <Text style={styles.inpuTitle}>Tanggal Lahir</Text>
          <TouchableOpacity
            style={[styles.input, {justifyContent: 'center'}]}
            onPress={showDatepicker}>
            <Text style={[styles.inputPlaceholder, {opacity: opacity}]}>
              {date.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </View>
        <Gap height={20} />
        <View style={styles.inputContainer}>
          <Text style={styles.inpuTitle}>Nomor Rekam Medis</Text>
          <TextInput
            style={styles.input}
            placeholder="Isi No Rekam Medis"
            onChangeText={text => setNoRM(text)}
          />
        </View>
        <Gap height={50} />
        <TouchableOpacity
          onPress={() => {
            storeData();
          }}
          style={styles.button}>
          <Text style={styles.buttonText}>Lanjutkan</Text>
        </TouchableOpacity>
        <Gap height={50} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    fontFamily: fonts.primary[700],
    fontSize: 20,
    color: colors.white,
    textAlign: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: colors.midDarkBlue,
  },
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: colors.white,
  },
  inpuTitle: {
    fontFamily: fonts.primary[600],
    fontSize: 16,
    color: colors.midDarkBlack,
    marginBottom: 5,
    marginLeft: 3,
  },
  image: {
    height: 200,
    width: 200,
  },
  titleScreen: {
    fontSize: 20,
    fontFamily: fonts.primary[600],
    color: colors.darkBlue,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.midDarkBlue,
    borderRadius: 15,
    paddingHorizontal: 15,
    width: '100%',
    height: 50,
    fontSize: 16,
    fontFamily: fonts.primary[400],
    color: colors.darkBlue,
  },
  inputPlaceholder: {
    width: '100%',
    opacity: 0.5,
    fontSize: 16,
    fontFamily: fonts.primary[400],
    color: colors.darkBlue,
  },
  inputContainer: {
    width: '100%',
  },
});
