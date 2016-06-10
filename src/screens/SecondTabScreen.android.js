import React, { Component } from 'react';

import {
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Picker,
  AsyncStorage,
  Alert
} from 'react-native';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
const Item = Picker.Item;

var SUPPORTED_ROUTES = {
  blank: { name: '', id: 14 } ,
  vashonFaunt: { name: 'Fauntleroy / Vashon', id: 14 } ,
  vashonSouth: { name: 'Southworth / Vashon', id: 15 },
  southFaunt:  { name: 'Fauntleroy / Southworth', id: 13 },
  anacortes:  { name: 'Anacortes / San Juan Islands / Sidney B.C.', id: 272 },
  edmonds:  { name: 'Edmonds / Kingston', id: 6 },
  mukclin:  { name: 'Mukilteo / Clinton', id: 7 },
  pttown:  { name: 'Port Townsend / Coupeville', id: 8 },
  ptdefiance:  { name: 'Pt. Defiance / Tahlequah', id: 1 },
  bainbridge:  { name: 'Seattle / Bainbridge Island', id: 5 },
  bremerton:  { name: 'Seattle / Bremerton', id: 3 },
};

export default class SecondTabScreen extends Component {
  static navigatorStyle = {
    drawUnderTabBar: true
  };
  
  constructor(props) {
    super(props);
    // if you want to listen on navigator events, set this up
    //this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this._onSaveRoute = this._onSaveRoute.bind(this)
    this.state = {
      preferredRoute: 0,
    };
    AsyncStorage.getItem("preferredRoute").then((value) => {
            this.setState({"preferredRoute": value});        }).done();
  }
  onNavigatorEvent(event) {
    if (event.id == 'menu') {
      this.props.navigator.toggleDrawer({
        side: 'left',
        animated: true
      });
    }
  }
  render() {
    return (
       <View>
       <View >
         <Picker
          style={{marginLeft:20, marginRight: 20, color: 'blue'}}
          selectedValue={this.state.preferredRoute}
          onValueChange={(routes) => this.saveData(routes)}>
            {Object.keys(SUPPORTED_ROUTES).map((routes) => (
                <Item
                key={SUPPORTED_ROUTES[routes]['id']}
                value={SUPPORTED_ROUTES[routes]['id']}
                label={SUPPORTED_ROUTES[routes]['name']}
          />
        ))}
      </Picker>
      </View>
      <View style={styles.quarterHeight} >
        <TouchableOpacity onPress={ this._onSaveRoute }>
           <Text style={styles.button}>Save Preferred Route </Text>
        </TouchableOpacity>
      </View></View>
    );
  }
  saveData(value) {
        // AsyncStorage.setItem("preferredRoute", value.toString());
        this.setState({"preferredRoute": value});
    //alert (value.toString());
  }
  _onSaveRoute() {
    console.log("hey");
    AsyncStorage.setItem("preferredRoute", this.state.preferredRoute.toString());
    // this.props.navigator.switchToTab({
    //   tabIndex: 0
    // });
  } 
}


var styles = StyleSheet.create({
    container: {
        flex: 1,   
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        width: width,
    },
    halfHeight: {
        width: width,
          justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DDDDDD', 
    },
    quarterHeight: {
         width: width,
     justifyContent: 'center',
        alignItems: 'center',
          backgroundColor: '#EEEEEE'
    },
   button: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 10,
    marginTop:10,
    color: 'blue'
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

