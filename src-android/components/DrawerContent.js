import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import firebase from 'react-native-firebase';

class DrawerContent extends Component {

  constructor(props){
    super(props);
    console.log("Drawer prosp - ", props);
  }
navigateToScreen = (route) => () => {
    const navigate = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigate);
  }

  signOut(){
    firebase.auth().signOut().then(() => {
        console.log('Signout Complete - ');
        this.props.screenProps.navigation.navigate('Auth');
    });
}
render () {
  console.log('DrawerContent called');
    return (
      <View>
        <ScrollView>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Forex Flares</Text>
          </View>
        <Button
         raised
         title='Logout'
         buttonStyle={styles.button}
         onPress={() => this.signOut()}/>
        </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  logoContainer: { 
      flex: 1, 
      backgroundColor: '#fff',
      paddingLeft: 15,
      paddingRight: 15,
      paddingTop: 20,
      paddingBottom: 20
   },
   logoText:{
     fontSize: 24
   },
   button:{
     backgroundColor: '#3498db'
   }

});

DrawerContent.propTypes = {
  navigation: PropTypes.object
};
export default DrawerContent;