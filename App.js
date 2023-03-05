import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import axios from 'axios';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Dropdown } from 'react-native-element-dropdown';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';

const App = () => {
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [rates, setRates] = useState([]);
  const [amount, setAmount] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [data, setData] = useState([]);

  // const YOUR_APP_ID = '7e7fb6cb51ad4b61aad9f5bf7452e258';
  useEffect(() => {
    try {
      ScreenOrientation.unlockAsync();
      axios
        .get(
          `https://openexchangerates.org/api/latest.json?app_id=7e7fb6cb51ad4b61aad9f5bf7452e258`
        )
        .then(response => {
          const ratesRespones = response.data.rates;
          setRates(ratesRespones);
        })
        .catch(error => {
          console.log(error);
        });


      axios
        .get(
          `https://openexchangerates.org/api/currencies.json`
        )
        .then(response => {
          const currenciesResponse = Object.keys(response.data).map(key => {
            return {
              label: `${key} - ${response.data[key]}`,
              value: key
            }
          });
          setData(currenciesResponse);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
    }

  }, []);

  useEffect(() => {
    try {
      setConvertedAmount(amount * (rates[toCurrency] / rates[fromCurrency]));
    } catch (error) {
      console.error(error);

    }
  }, [toCurrency, fromCurrency, amount])

  const onFormatNumber = (amount) => {
    if (amount) {
      return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return '0';
    }
  }
  const onChangeCurrent = () => {
    const fromCurrencyChange = fromCurrency;
    const toCurrencyChange = toCurrency;
    setFromCurrency(toCurrencyChange);
    setToCurrency(fromCurrencyChange);
  }
  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="rgba(0, 0, 0, 0.7)"
        barStyle="light-content"
        translucent={false}
      />
      <ScrollView>

        <View style={styles.container2}>

          <Text style={styles.title}>Quy đổi tiền tệ</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nhập sô tiền.."
              keyboardType="numeric"
              onChangeText={text => setAmount(text)}
            />
            <Dropdown
              style={[styles.dropdown, open1 && { borderColor: 'blue' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={data}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!open1 ? 'Select item' : '...'}
              searchPlaceholder="Search..."
              value={fromCurrency}
              onFocus={() => setOpen1(true)}
              onBlur={() => setOpen1(false)}
              onChange={item => {
                setFromCurrency(item.value);
                setOpen1(false);
              }}
              renderLeftIcon={() => (
                <FontAwesome5
                  style={styles.icon}
                  color={open1 ? 'gold' : 'black'}
                  name="coins"
                  size={20}
                />
              )}
            />
          </View>
          <TouchableOpacity style={styles.iconChange} onPress={() => onChangeCurrent()}>
            <AntDesign
              color={'white'}
              name="arrowup"
              size={20}
            />
            <AntDesign
              color={'white'}
              name="arrowdown"
              size={20}
            />
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={onFormatNumber(convertedAmount)}
              editable={false}
            />
            <Dropdown
              style={[styles.dropdown, open2 && { borderColor: 'blue' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={data}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!open2 ? 'Select item' : '...'}
              searchPlaceholder="Search..."
              value={toCurrency}
              onFocus={() => setOpen2(true)}
              onBlur={() => setOpen2(false)}
              onChange={item => {
                setToCurrency(item.value);
                setOpen2(false);
              }}
              renderLeftIcon={() => (
                <FontAwesome5
                  style={styles.icon}
                  color={open2 ? 'gold' : 'black'}
                  name="coins"
                  size={20}
                />
              )}
            />
          </View>
        </View>
      </ScrollView>
    </View>

  );
};
const styles = StyleSheet.create({
  iconChange: {
    flexDirection: 'row',
  },
  title: {
    width: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 26,
    marginVertical: 30,
    fontWeight: '600',
    color: 'white'
  },
  inputContainer: {
    width: '85%',
    alignItems: 'center',
    borderColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 30,
    marginHorizontal: 16,
    marginVertical: 30,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.4)'
  },
  input: {
    width: '90%',
    backgroundColor: '#f7f7f7',
    color: '#333',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
    padding: 10,
    fontSize: 16,

  },
  dropdown: {
    marginTop: 16,
    height: 50,
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  container2: {
    alignItems: 'center',
  },
  container: {
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});


export default App;
