import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {ILSignup, ILHome} from '../../assets';
import PushNotification, {Importance} from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors, fonts} from '../../utils';
import {Gap} from '../../components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import 'moment/locale/id'; // without this line it didn't work
moment.locale('id');

export default function App({navigation}) {
  const [loading, setLoading] = useState(true);
  const [biodata, setBiodata] = useState();
  const [dataAlarm, setDataAlarm] = useState([]);
  const [newDataAlarm, setNewDataAlarm] = useState();
  const tglSekarang = moment().utcOffset('+0').format(`dddd, DD MMMM YYYY`);

  // console.log(dataAlarm);

  const getData = async () => {
    try {
      const biodata = await AsyncStorage.getItem('biodata');
      const dataAlarm = await AsyncStorage.getItem('dataAlarm');
      biodata !== null ? setBiodata(JSON.parse(biodata)) : null;
      dataAlarm !== null ? setDataAlarm(JSON.parse(dataAlarm)) : null;
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };
  const handleRefresh = React.useCallback(val => {
    getData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // alert('Refreshed');
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  const deleteData = async () => {
    try {
      await AsyncStorage.removeItem('dataAlarm');
      setDataAlarm([]);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteAllNotif = () => {
    PushNotification.cancelAllLocalNotifications();
  };

  const getAll = () => {
    PushNotification.getScheduledLocalNotifications(localNotifications => {
      console.log(localNotifications);
    });
  };

  const deleteAlarm = async id => {
    var lists = dataAlarm.filter(x => {
      return x.id != id;
    });
    setNewDataAlarm(lists);
    await AsyncStorage.removeItem('dataAlarm');
    await AsyncStorage.setItem('dataAlarm', JSON.stringify(lists));
    setDataAlarm(lists);
    PushNotification.cancelLocalNotification({id: `9${id}`});
    PushNotification.cancelLocalNotification({id: `8${id}`});
    handleRefresh();
  };

  const checkPermision = () => {
    PushNotification.checkPermissions(permissions => {
      console.log(permissions);
    });
  };

  if (loading) {
    return <Text>Loading...</Text>;
  } else {
    const noData = () => {
      return (
        <View style={styles.noData}>
          <Text style={styles.noDataText}>
            Belum ada data untuk ditampilkan
          </Text>
        </View>
      );
    };

    const myData = []
      .concat(dataAlarm)
      .sort((a, b) => (a.waktu > b.waktu ? 1 : -1))
      .map((item, index) => (
        <View
          key={index}
          style={[styles.itemContainer, {alignItems: 'center'}]}>
          <View style={{flex: 5}}>
            <View style={{flexDirection: 'row'}}>
              <MaterialCommunityIcons
                style={{marginRight: 10, marginTop: 3}}
                onPress={() => navigation.navigate('RecipeScreen')}
                name="pill"
                size={20}
                color={colors.midDarkBlue}
              />
              <View>
                <Text style={{fontFamily: fonts.primary[700], fontSize: 17}}>
                  {item.obat}
                </Text>
                <Text style={{fontFamily: fonts.primary[400], fontSize: 13}}>
                  {item.angkaDosis} x {item.dosis}
                </Text>
              </View>
            </View>
            <Gap height={5} />
            <View style={{flexDirection: 'row'}}>
              <MaterialCommunityIcons
                style={{marginRight: 10}}
                onPress={() => navigation.navigate('RecipeScreen')}
                name="alarm"
                size={20}
                color={colors.midDarkBlue}
              />
              <View>
                <Text style={{fontFamily: fonts.primary[600], fontSize: 15}}>
                  {item.waktu}
                </Text>
              </View>
            </View>
          </View>
          <View style={{flex: 1}}>
            <MaterialCommunityIcons
              style={{alignSelf: 'flex-end'}}
              onPress={() => deleteAlarm(item.id)}
              name="delete-forever"
              size={50}
              color={colors.midDarkRed}
            />
          </View>
        </View>
      ));

    // console.log(myData);

    return (
      <View style={styles.container}>
        <View style={{padding: 20}}>
          <Image source={ILHome} style={styles.image} />
          <Gap height={150} />
          <View style={styles.homeContainer}>
            <View style={{flex: 1}}>
              <Text
                style={[styles.boldTextHomeContainer, {color: colors.black}]}>
                Hai,{' '}
                <Text
                  style={[
                    styles.boldTextHomeContainer,
                    {color: colors.primaryBlue},
                  ]}>
                  {biodata.nama}
                </Text>
              </Text>
              <Text style={[styles.liteTextHomeContainer, {textAlign: 'left'}]}>
                {biodata.noRM}
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                style={[styles.liteTextHomeContainer, {textAlign: 'right'}]}>
                {tglSekarang}
              </Text>
            </View>
          </View>
        </View>
        <ScrollView style={{flex: 1, width: '100%', paddingHorizontal: 10}}>
          {dataAlarm != null && dataAlarm.length > 0 ? (
            myData
          ) : (
            <View>
              <Text
                style={{
                  fontFamily: fonts.primary[700],
                  textAlign: 'center',
                  fontSize: 18,
                }}>
                Belum Ada Reminder
              </Text>
            </View>
          )}
          {/* <Gap height={50} />
          <Button title="Delete All Notif" onPress={() => deleteAllNotif()} />
          <Gap height={50} />
          <Button title="Delete Data Store" onPress={() => deleteData()} />
          <Gap height={50} />
          <Button title="Check Permision" onPress={() => checkPermision()} />
          <Button title="Get All Scheduled" onPress={() => getAll()} /> */}
          <Gap height={100} />
        </ScrollView>
        <MaterialCommunityIcons
          style={{
            position: 'absolute',
            right: 20,
            bottom: 20,
            backgroundColor: colors.white,
            borderRadius: 50,
          }}
          onPress={() => navigation.navigate('RecipeScreen')}
          name="plus-circle"
          size={60}
          color={colors.midDarkBlue}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  boldTextHomeContainer: {
    textAlign: 'left',
    fontFamily: fonts.primary[600],
    fontSize: 18,
  },
  liteTextHomeContainer: {
    fontFamily: fonts.primary[400],
    fontSize: 16,
    color: colors.black,
  },
  homeContainer: {
    backgroundColor: colors.white,
    padding: 15,
    paddingHorizontal: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    elevation: 10,
    margin: 5,
    borderRadius: 5,
  },
  itemContainer: {
    backgroundColor: colors.white,
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    elevation: 7,
    borderRadius: 5,
  },
  image: {
    height: 330,
    width: 330,
    position: 'absolute',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
    // padding: 20,
  },
});
