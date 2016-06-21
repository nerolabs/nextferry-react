//
//  TODO: 
//
//    Fix all of the whitespacing issues.
//    Fix all of my tabbing issues.
//    Choose a consistent bracket convention.
//

var REQUEST_URL = 'http://ec2-54-186-56-115.us-west-2.compute.amazonaws.com/v0/ferry';


import React, { Component, PropTypes } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  AsyncStorage,
  View
} from 'react-native';

import { connect } from 'react-redux';
import * as storedRouteActions from '../reducers/storedRoute/actions';

import MapView from 'react-native-maps';
import TimerMixin from 'react-timer-mixin';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

var date = require('date-and-time');

class FirstTabScreen extends Component {
    constructor(props) {
    super(props);

    // TODO:  Clean out these bindings. I don't think they are needed.
    this.getData = this.getData.bind(this)
    this.fetchData = this.fetchData.bind(this)

    // TODO:  I took the default preferred route out of here. 
    //        Let's implement a better way of determining preferred route if none is given.
    this.state = {
      locations: null,
      schedule: null
    };

  }

  watchID() {}

  _loadInitialState(){
    // TODO:  double check that we actually need to store that value.
    var that = this;
    return new Promise(function(resolve, reject){
      AsyncStorage.getItem("preferredRoute").then((value) => {
        if(!value){
          reject({"error" : Error("Async Key Not Found"), that});
        }
        resolve({value, that});
      });
    });
  }

  getData(value)
  {
    // TODO: double check that we actually need to store that value.
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
      (error) => alert(error.message), // TODO: implement better error handling.
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
      
    })

  }

  fetchData(value) {
    // TODO: double check that we actually need to store that value.
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

  dataProcess(){
    this._loadInitialState()
      .then(function(response){
        console.log("success!", response);
        return response.that.getData(response);
      }, function(error){

        console.log("error", error.error);
        // TODO: Actually implement error handling at this stage. This error handling is naive and simply covering the exceptions.
        return error.that.getData({"value" : 14, "that" : error.that});
      })
      .then(function(response){

        console.log("getData Success!", response);
        return response.that.fetchData(response);

      }, function(error){
        // TODO: Actually implement error handling at this stage.
        console.log("getData error", error);

      })
      .then(function(value){
        console.log("fetchData success!", value);
        value.that.setState({"locations" : value.locations, "initialPositionLat" : value.initialPositionLat,
          "initialPositionLong" : value.initialPositionLong, "lastPositionLat" : value.lastPositionLat,
          "lastPositionLong" : value.lastPositionLong, "preferredRoute" : value.route,
          "schedule" : value.schedule, initialLoad : true});
        value.that.props.dispatch(storedRouteActions.storeRoute(value.route.toString()));
      }, function(error){
        // TODO: Actually implement error handling at this stage.
        console.log("fetchData error", error);
      }
        
      );
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
    // TODO: improve the readability of the below statement block. This thing looks like one mean block of code.
    if(!this.state.ranOnce && (!this.state.runCount || this.state.runCount != 1)){
      this.state.runCount = 1;
      this.dataProcess();
    }
  }
  
  componentWillReceiveProps(nextProps){
    // TODO:  This is working, but I am not sure if this is the best.
    if(nextProps.storedRoute.preferredRoute != this.state.preferredRoute)
    {
      this.setState({
        "preferredRoute" : nextProps.storedRoute.preferredRoute,
        "initialLoad" : false
      });
      this.dataProcess();
    }
    // TODO: I am not confident this return statement is even required or doing something.
    return true;
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  shouldComponentUpdate(nextProps, nextState){
    // TODO:  This is not doing anything at all. I know I need to utilize this to improve performance.
    //        Leaving this in as a reminder to come back and properly set this function up.
    if((nextProps.storedRoute.preferredRoute != this.props.storedRoute.preferredRoute) || (this.state.preferredRoute != nextState.preferredRoute)){
      return true;
    }
    return true;
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

    //TODO: Remove all of non-render logic from this function. This should be in a redux reducer
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

    // TODO: Take this out of the render call and put it in a redux reducer
    this.props.navigator.setTitle({
       title: sched["routeName"]
    });

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

function mapStateToProps(state){
  return {
    storedRoute: state.storedRoute
  };
}

export default connect(mapStateToProps)(FirstTabScreen);