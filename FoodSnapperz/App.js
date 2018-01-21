 import React from 'react';
 import {Text, View} from 'react-native';

 import {TabNavigator} from 'react-navigation';
 import first from './tabs/first';
 import second from './tabs/second';

 var MainScreenNavigator = TabNavigator({
   Camera: {screen: first},
   Info: {screen: second}
 }, {
   tabBarPosition: 'bottom',
   swipeEnabled: true,
   tabBarOptions: {
     activeTintColor: 'white',
     //inactiveBackgroundColor: 'blue',
     activeBackgroundColor: 'lightblue',
     labelStyle: {
       fontSize: 16,
       padding: 0
     }
   }
 }

);

MainScreenNavigator.navigationOptions = {
  title: "FoodSnapper"
};

export default MainScreenNavigator;
