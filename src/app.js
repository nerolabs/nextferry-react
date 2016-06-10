import React, { Component } from 'react';
import {
  AppRegistry,
  View
} from 'react-native';
import { Navigation } from 'react-native-navigation';

  

// screen related book keeping
import { registerScreens } from './screens';
registerScreens();

AppRegistry.registerComponent('App', () => App);

export default class App extends Component {
  constructor(props) {
    super(props);
    // store.subscribe(this.onStoreUpdate.bind(this));
    // store.dispatch(appActions.appInitialized());
  }


  render() {
    return (
        <View />
    );
  }
}

// this will start our app
Navigation.startTabBasedApp({
  tabs: [
    {
      label: 'Home',
      screen: 'example.FirstTabScreen',
      icon: require('../img/one.png'),
      selectedIcon: require('../img/one_selected.png'),
      title: 'Next Ferry',
      navigatorStyle: {
        navBarBackgroundColor: '#FFFFFF',
        navBarTextColor: '#000000',
        navBarButtonColor: '#ffffff',
        statusBarTextColorScheme: 'light'
      }
    },
    {
      label: 'Route',
      screen: 'example.SecondTabScreen',
      icon: require('../img/two.png'),
      selectedIcon: require('../img/two_selected.png'),
      title: 'Choose Route',
      navigatorStyle: {
        navBarBackgroundColor: '#FFFFFF',
        navBarTextColor: '#000000',
        navBarButtonColor: '#ffffff',
        statusBarTextColorScheme: 'light'
      }
    }
  ]
});
