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
import React, {useState, useEffect} from 'react';
import {ILSignup, ILRecipe} from '../../assets';
import {colors, fonts} from '../../utils';
import {Gap} from '../../components';
import DatePicker from 'react-native-date-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import 'moment/locale/id'; // without this line it didn't work
moment.locale('id');
import NotifService from '../../NotifService';

export default function Recipe({navigation}) {
  const [registerToken, setRegisterToken] = useState('');
  const [fcmRegistered, setFcmRegistered] = useState(false);
  // const realAlarm = new Date(date - 7 * 60 * 60 * 1000);
  // const cautionAlarm = new Date(date - 7 * 60 * 60 * 1000 - 5 * 60 * 1000); // 2 menit sebelum waktu minum obat
  // console.log(realAlarm);

  const tanggal = moment().format('YYYY-MM-DDTHH:mm:ss');
  const [obat, setObat] = useState('');
  const [dosis, setDosis] = useState('');
  const [angkaDosis, setAngkaDosis] = useState(1);
  const [open, setOpen] = useState(false);

  const [displayTime, setDisplayTime] = useState();
  const [date, setDate] = useState(new Date(tanggal));
  const [biodata, setBiodata] = useState();
  const [dataAlarm, setDataAlarm] = useState();
  // const [lastId, setLastId] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notNull, setNotNull] = useState(true);
  const [isiJam, setIsiJam] = useState(false);

  const onRegister = token => {
    setRegisterToken(token.token);
    setFcmRegistered(true);
  };

  const onNotif = notif => {
    Alert.alert(notif.title, notif.message);
  };

  const notif = new NotifService(onRegister, onNotif);

  const handlePerm = perms => {
    Alert.alert('Permissions', JSON.stringify(perms));
  };

  const getData = async () => {
    try {
      const biodata = await AsyncStorage.getItem('biodata');
      const dataAlarm = await AsyncStorage.getItem('dataAlarm');
      biodata != null ? setBiodata(JSON.parse(biodata)) : null;
      dataAlarm != null ? setDataAlarm(JSON.parse(dataAlarm)) : null;
      if (dataAlarm !== null && JSON.parse(dataAlarm).length !== 0) {
        setNotNull(false);
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // alert('Refreshed');
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return <Text>Loading...</Text>;
  } else {
    var lastId;
    if (notNull) {
      lastId = 1;
    } else {
      lastId = dataAlarm[dataAlarm.length - 1].id + 1;
    }

    const setReminder = async () => {
      try {
        if (
          obat === '' ||
          dosis === '' ||
          angkaDosis === '' ||
          isiJam === false
        ) {
          Alert.alert(
            'Data Reminder Tidak Lengkap',
            'Masukkan Semua Data Yang di Butuhkan',
          );
        } else {
          const jsonValue = {
            id: lastId,
            obat: obat,
            dosis: dosis,
            angkaDosis: angkaDosis,
            waktu: displayTime,
          };

          AsyncStorage.getItem('dataAlarm', (err, result) => {
            const datanya = [jsonValue];
            if (result !== null) {
              console.log('Data Found', result);
              const newData = JSON.parse(result).concat(jsonValue);
              console.log(JSON.stringify(newData));
              AsyncStorage.setItem('dataAlarm', JSON.stringify(newData));
            } else {
              console.log('Data Not Found');
              console.log(JSON.stringify(datanya));
              AsyncStorage.setItem('dataAlarm', JSON.stringify(datanya));
            }
          });

          notif.scheduleNotif({
            id: `9${lastId}`,
            date: date,
            sound: 'sound.mp3',
            title: 'MediMinder',
            message: `${biodata.nama}, Waktunya Minum Obat ${obat}`,
          });
          notif.cautionScheduleNotif({
            id: `8${lastId}`,
            date: date,
            sound: 'sound.mp3',
            title: 'MediMinder',
            message: `${biodata.nama}, Sebentar lagi jadwalnya minum ${obat}`,
          });

          await navigation.navigate('HomeScreen');
        }
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <ScrollView style={styles.container}>
        <View style={{alignItems: 'center'}}>
          <Image source={ILRecipe} style={styles.image} />
          <Gap height={20} />
          <Text style={styles.titleScreen}>Masukkan Obat</Text>
          <Gap height={20} />
          <View style={styles.inputContainer}>
            <Text style={styles.inpuTitle}>Nama Obat</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan Nama Obat"
              onChangeText={text => setObat(text)}
            />
          </View>
          <Gap height={20} />
          <View style={styles.inputContainer}>
            <Text style={styles.inpuTitle}>Dosis</Text>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <MaterialCommunityIcons
                  onPress={() => {
                    angkaDosis > 1
                      ? setAngkaDosis(angkaDosis - 1)
                      : setAngkaDosis(1);
                  }}
                  name="minus-box"
                  size={30}
                  color={colors.midDarkBlue}
                />
                <Gap width={2} />
                <View
                  style={[
                    styles.input,
                    {
                      justifyContent: 'center',
                      width: '60%',
                      paddingHorizontal: 0,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.inputPlaceholder,
                      {opacity: 1, textAlign: 'center'},
                    ]}>
                    {angkaDosis} X
                  </Text>
                </View>
                <Gap width={2} />
                <MaterialCommunityIcons
                  onPress={() => {
                    angkaDosis <= 5
                      ? setAngkaDosis(angkaDosis + 1)
                      : setAngkaDosis(angkaDosis);
                  }}
                  name="plus-box"
                  size={30}
                  color={colors.midDarkBlue}
                />
              </View>
              <Gap width={15} />
              <View
                style={[
                  styles.input,
                  {
                    flexDirection: 'row',
                    paddingHorizontal: 0,
                    flex: 1,
                    alignItems: 'center',
                  },
                ]}>
                <TextInput
                  style={{
                    fontFamily: fonts.primary[400],
                    fontSize: 16,
                    flex: 3,
                    paddingHorizontal: 15,
                  }}
                  // keyboardType="number-pad"
                  placeholder="Dosis"
                  onChangeText={text => setDosis(text)}
                />
                {/* <Text
                style={{
                  fontFamily: fonts.primary[400],
                  fontSize: 16,
                  flex: 1,
                }}>
                mg
              </Text> */}
              </View>
            </View>
          </View>
          <Gap height={20} />
          <View style={styles.inputContainer}>
            <Text style={styles.inpuTitle}>Jadwal Minum Obat</Text>
            <TouchableOpacity
              style={[styles.input, {justifyContent: 'center'}]}
              onPress={() => setOpen(true)}>
              <Text style={[styles.inputPlaceholder, {opacity: 1}]}>
                {displayTime == undefined ||
                displayTime == '' ||
                displayTime == null
                  ? 'Pilih Waktu Minum Obat'
                  : displayTime}
              </Text>
            </TouchableOpacity>
          </View>
          <Gap height={50} />
          <TouchableOpacity
            onPress={() => {
              setReminder();
            }}
            style={styles.button}>
            <Text style={styles.buttonText}>Set Reminder</Text>
          </TouchableOpacity>
          <Gap height={50} />
        </View>
        <DatePicker
          modal
          timeZoneOffsetInMinutes={0}
          title={'Pilih Waktu'}
          confirmText={'Pilih'}
          cancelText={'Batal'}
          mode={'time'}
          open={open}
          date={date}
          onConfirm={date => {
            setOpen(false);
            setDate(date);
            setIsiJam(true);
            setDisplayTime(moment(date).utcOffset(0).format('HH:mm:ss'));
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </ScrollView>
    );
  }
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
    height: 50,
    fontSize: 16,
    fontFamily: fonts.primary[400],
    color: colors.darkBlue,
  },
  inputPlaceholder: {
    width: '100%',
    opacity: 0.5,
    fontSize: 16,
    fontFamily: fonts.primary[600],
    color: colors.darkBlue,
  },
  inputContainer: {
    width: '100%',
  },
});
