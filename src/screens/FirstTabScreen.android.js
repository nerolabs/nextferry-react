//
//  TODO: 
//
//    Update FirstTabScreen on SecondTabScreen Select
//

var REQUEST_URL = 'http://ec2-54-186-56-115.us-west-2.compute.amazonaws.com/v0/ferry';

import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  AsyncStorage,
  View
} from 'react-native';

import MapView from 'react-native-maps';
import TimerMixin from 'react-timer-mixin';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

var date = require('date-and-time');

export default class FirstTabScreen extends Component {
    constructor(props) {
    super(props);

    //TODO: Clean out these bindings. I don't think they are needed.
    this.getData = this.getData.bind(this)
    this.fetchData = this.fetchData.bind(this)
    this.state = {
      locations: null,
      schedule: null,
      preferredRoute: 14 // TODO: Examine how to leverage default preferredRoute.
    };
    
    // Unsure if this is implemented in Android.
    //this.props.navigator.toggleTabs({to: 'hidden'})
  }

  watchID() {}

  _loadInitialState(){
    var that = this;
    return new Promise(function(resolve, reject){
      AsyncStorage.getItem("preferredRoute").then((value) => {
        if(!value){
          reject(Error(req.statusText));
        }
        resolve({value, that});
      });
    });
  }

  getData(value)
  {
    var that = this;
    
    return new Promise(function(resolve, reject){
      navigator.geolocation.getCurrentPosition((position) =>{
        var route = value.value;
        var initialPositionLat = JSON.stringify(position.coords.latitude);
        var initialPositionLong = JSON.stringify(position.coords.longitude);
        var lastPositionLat = initialPositionLat;
        var lastPositionLong = initialPositionLong;
        var locations = true;
        var request = REQUEST_URL + '?route=' + route + '&lat=' + initialPositionLat + "&long=" + initialPositionLong;
        resolve({locations, initialPositionLat, initialPositionLong, lastPositionLat, lastPositionLong, route, request, "that" : value.that});
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
      
    })

  }

  fetchData(value) {
    var that = value.that;

    return new Promise(function(resolve, reject){
      fetch(value.request)
        .then((response) => response.json())
        .then((responseData) => {
          value["schedule"] = responseData;
          resolve(value);
        });
    });
    
  }

  componentDidMount() {
    if(!this.watchID){
      this.watchID = navigator.geolocation.watchPosition((position) => {
        var lastPositionLat = JSON.stringify(position.coords.latitude);      
        var lastPositionLong = JSON.stringify(position.coords.longitude);
        this.fetchData(REQUEST_URL + '?route=' + this.state.preferredRoute + '&lat=' + lastPositionLat + "&long=" + lastPositionLong);
        this.setState({lastPositionLat, lastPositionLong});
      });
    }
  }

  componentWillMount() {
    this.props.navigator.testTitle({"title":"test", "screen" : "example.FirstTabScreen"});
    console.log("componentWillMount");
    if(!this.state.ranOnce && (!this.state.runCount || this.state.runCount != 1)){
      this.state.runCount = 1;
        this._loadInitialState()
          .then(function(response){

            console.log("success!", response);
            return response.that.getData(response);

          }, function(error){

            console.log("error", error);

          })
          .then(function(response){

            console.log("getData Success!", response);
            return response.that.fetchData(response);

          }, function(error){

            console.log("getData error", error);

          })
          .then(function(value){
            console.log("fetchData success!", value);
            value.that.setState({"locations" : value.locations, "initialPositionLat" : value.initialPositionLat,
              "initialPositionLong" : value.initialPositionLong, "lastPositionLat" : value.lastPositionLat,
              "lastPositionLong" : value.lastPositionLong, "preferredRoute" : value.route,
              "schedule" : value.schedule, initialLoad : true});
          }, function(error){
            console.log("fetchData error", error);
          }
            
          );
      console.log(this.state);
    }
  }
  
  

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }


  render() {

    if(!this.state.initialLoad){
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
    var departingTimeRaw;
    var departingTime;
    var departingTimeObj;
    var departingVesselName;

    var departingTimeRaw2;
    var departingTime2;
    var departingTimeObj2;
    var departingVesselName2;

    width = Dimensions.get('window').width; //full width
    height = Dimensions.get('window').height; //full height
    var sched = this.state.schedule.response;
    

    // Doing some hacky cleaning for improper responses from the ferry API
    if(sched["times"][0] === null || (typeof sched["times"][0] == "string" && sched["times"][0].indexOf("unknown") != -1)){
      departingTime = "Unknown";
      departingVesselName = "Unknown";
    }
    else{
      departingTimeRaw = JSON.stringify(sched["times"][0]["DepartingTime"]);
      departingTime = departingTimeRaw.split('T');
      departingTimeObj = date.parse(departingTimeRaw[1], 'HH:mm:ss');
      departingTime = date.format(departingTimeObj, 'hh:mm A');
      departingVesselName = sched["times"][0]["VesselName"];
    }
    
    // Doing some hacky cleaning for improper responses from the ferry API
    if(sched["times"][1] === null || (typeof sched["times"][1] == "string" && sched["times"][1].indexOf("unknown") != -1)){
      departingTime2 = "Unknown";
      departingVesselName2 = "Unknown";
    }
    else{
      departingTimeRaw2 = JSON.stringify(sched["times"][1]["DepartingTime"]);
      departingTime2 = departingTimeRaw2.split('T');
      departingTimeObj2 = date.parse(departingTimeRaw2[1], 'HH:mm:ss');
      departingTime2 = date.format(departingTimeObj2, 'hh:mm A');
      departingVesselName2 = sched["times"][1]["VesselName"];
    }

    var departingTerminal = sched["departingTerminal"];
    var departingTerminalLat = parseFloat(sched["location"]["latitude"]);
    var departingTerminalLong = parseFloat(sched["location"]["longitude"]);
    var departingTerminalDistance = (parseFloat(sched["location"]["distance"]) *0.000621371192).toFixed(2);

    // This call is not implemented for Android.
    // TODO: Find Android replacement.
    // this.props.navigator.setTitle({
    //    title: sched["routeName"]
    // });

    return (
      <View style={styles.container} key={this.state.preferredRoute}>
        <MapView style={styles.halfHeight}
          region={{
            latitude: parseFloat(this.state.lastPositionLat),
            longitude: parseFloat(this.state.lastPositionLong),
            latitudeDelta: Math.abs((parseFloat(this.state.lastPositionLat) - departingTerminalLat) * 3),
            longitudeDelta: Math.abs((parseFloat(this.state.lastPositionLong) - departingTerminalLong) * 3),
          }}>
          <MapView.Marker 
            coordinate={{
                latitude: parseFloat(this.state.lastPositionLat),
                longitude: parseFloat(this.state.lastPositionLong)}}
            image={require('../../img/current-location.png')}    
           />
           <MapView.Marker 
            coordinate={{
                latitude: departingTerminalLat,
                longitude: departingTerminalLong
              }}
           />
        </MapView>
         <View style={[styles.quarterHeight, {backgroundColor: '#DDDDDD'}]}>
             <Text style={styles.time}>Closest Dock:</Text> 
             <Text style={styles.terminal}>{departingTerminal}</Text> 
             <Text style={styles.time}>{departingTerminalDistance} miles away</Text> 
         </View>
         <View style={[styles.quarterHeight, {backgroundColor: '#CCCCCC'}]} >
           <Text style={styles.title}>First Boat: </Text>
           <Text style={styles.time}>{departingTime}</Text>
           <Text style={styles.time}>{departingVesselName}</Text>
         </View>
         <View style={styles.quarterHeight} >
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
    },
    terminal: {
      fontSize: 20,
      textAlign: 'center',
    }


});
