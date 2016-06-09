/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

var REQUEST_URL = 'http://ec2-54-186-56-115.us-west-2.compute.amazonaws.com/v0/ferry?route=14';

import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';

import MapView from 'react-native-maps';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

var date = require('date-and-time');

class NextFerry extends Component {
    constructor(props) {
    super(props);
    this.state = {
      locations: null,
      schedule: null
    };
   }
   watchID() {}

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPositionLat = JSON.stringify(position.coords.latitude);
        var initialPositionLong = JSON.stringify(position.coords.longitude);
        this.setState({initialPositionLat});
        this.setState({initialPositionLong});
        this.state.locations=true;
        this.fetchData(REQUEST_URL + "&lat=" + initialPositionLat + "&long=" + initialPositionLong);
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPositionLat = JSON.stringify(position.coords.latitude);      
      var lastPositionLong = JSON.stringify(position.coords.longitude);
      this.setState({lastPositionLat});
      this.setState({lastPositionLong});
      this.fetchData(REQUEST_URL + "&lat=" + lastPositionLat + "&long=" + lastPositionLong);
    });
    
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  fetchData(req) {
    fetch(req)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          schedule: responseData,
        });
      })
      .done();
  }

  render() {
    if (!this.state.initialPositionLat || !this.state.schedule) {
      return this.renderLoadingView();
    }
    return this.renderLocation();
  }

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>
          Loading Next Ferry...
        </Text>
      </View>
    );
  }


  renderLocation() {
    width = Dimensions.get('window').width; //full width
    height = Dimensions.get('window').height; //full height
    var sched = this.state.schedule.response;
    var departingTimeRaw = JSON.stringify(sched["times"][0]["DepartingTime"]).split('T');
    var departingTimeObj = date.parse(departingTimeRaw[1], 'HH:mm:ss') 
    var departingTime = date.format(departingTimeObj, 'hh:mm A');
    var departingTerminal = sched["departingTerminal"];
    var departingVesselName = sched["times"][0]["VesselName"];


    departingTimeRaw = JSON.stringify(sched["times"][1]["DepartingTime"]).split('T');
    departingTimeObj = date.parse(departingTimeRaw[1], 'HH:mm:ss') 
    var departingTime2 = date.format(departingTimeObj, 'hh:mm A');
    var departingVesselName2 = sched["times"][1]["VesselName"];
    
    var departingTerminalLat = parseFloat(sched["location"]["latitude"]);
    var departingTerminalLong = parseFloat(sched["location"]["longitude"]);

    return (
      <View style={styles.container}>
        <MapView style={styles.halfHeight}
          region={{
            latitude: parseFloat(this.state.lastPositionLat),
            longitude: parseFloat(this.state.lastPositionLong),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <MapView.Marker 
            coordinate={{
                latitude: parseFloat(this.state.lastPositionLat),
                longitude: parseFloat(this.state.lastPositionLong)}}
            image={require('./current-location.png')}    
           />
           <MapView.Marker 
            coordinate={{
                latitude: departingTerminalLat,
                longitude: departingTerminalLong
              }}
           />
        </MapView>
         <View style={[styles.quarterHeight, {backgroundColor: '#DDDDDD'}]}>
             <Text style={styles.title}>NEXT FERRY</Text> 
             <Text style={styles.time}>Closest Dock: {departingTerminal}</Text> 
         </View>
         <View style={[styles.quarterHeight, {backgroundColor: '#CCCCCC'}]}>
           <Text style={styles.title}>First Boat: </Text>
           <Text style={styles.time}>{departingTime}</Text>
           <Text style={styles.time}>{departingVesselName}</Text>
         </View>
         <View style={styles.quarterHeight}>
           <Text style={styles.title}>Second Boat: </Text>
           <Text style={styles.time}>{departingTime2}</Text>
           <Text style={styles.time}>{departingVesselName2}</Text>
         </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
    container: {
        marginTop: 30,
        flex: 1,   
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        width: width,
    },
    halfHeight: {
        flex: 2,
        width: width,
          justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DDDDDD', 
    },
    quarterHeight: {
        flex: 1,
         width: width,
     justifyContent: 'center',
        alignItems: 'center',
          backgroundColor: '#EEEEEE'
    },
    title: {
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 20,
        alignItems: 'center',
        textAlign: 'center',
    },
    time: {
      textAlign: 'center',
    }


});


AppRegistry.registerComponent('NextFerry', () => NextFerry);
