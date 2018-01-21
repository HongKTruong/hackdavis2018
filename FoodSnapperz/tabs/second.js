import React from 'react';
import {Text,View,Button,Image} from 'react-native';

export default class second extends React.Component{
  static navigationOptions = {
    tabBarLabel: 'Info',
    tabBarIcon: ({tintColor}) => (
      <Image
        source={require('../image/monitor.png')}
        style={{width: 22, height: 22, tintColor: 'white'}}>
      </Image>
    )
  }

  render() {
    return <View style={
      {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFEB3B'
      }
    }>
    <Text style={{fontSize: 30}}> This is tab 2 </Text>
    </View>
  }
}
