//
//  TODO: 
//
//    Fix all of the whitespacing issues.
//    Fix all of my tabbing issues.
//    Choose a consistent bracket convention.
//	  Improve the import situation at the top. At least alphabetize it.
//
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import * as reducers from './reducers';
import * as routeActions from './reducers/prefroute/actions';
import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  View
} from 'react-native';
import { Navigation } from 'react-native-navigation';


  
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);


// screen related book keeping
import { registerScreens } from './screens';
registerScreens(store, Provider);

export default class App {
	constructor() {
		store.subscribe(this.onStoreUpdate.bind(this));
		store.dispatch(routeActions.appInitialized());
	}

	onStoreUpdate() {
		// TODO: 	Technically we never change root. So we can refactor this and the below function.
		//			This means we will also need to refactor the redux logic.
		const { root } = store.getState().prefroute;

		if(this.currentRoot != root){
			this.currentRoot = root;
			this.startApp(root);
		}
	}

	startApp(root){
		switch(root){
			case 'primary':
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
		}
	}
}
