import React from 'react';
import { 
        Text, 
        View,
        Button
    } from 'react-native';
import AppConst from '../../utils/AppConstants';
import AppTabs from './AppTabs';
import firebase from 'react-native-firebase';

class MainAppContainer extends React.Component{

    static navigationOptions = AppConst.NAVIGATION_OPTTIONS;
    
    constructor(props){
        super(props);
        firebase.messaging().hasPermission()
        .then(enabled => {
            if (enabled) {
            console.log("User has permission")
            } else {
                this.getMessagePermission();
            } 
        });
        
    }
componentDidMount() {
    firebase.messaging().getToken()
    .then((token) => {
        console.warn('Device FCM Token: ', token);
    });

    firebase.admob().initialize(AppConst.ADMOB_ID);
    firebase.admob().openDebugMenu();
  }

    getMessagePermission = async () => {
        try {
            await firebase.messaging().requestPermission();
            console.log("Permission granted");
        } catch (error) {
            console.log("Permission denied");
        }
    }
    render(){
        return (
            <AppTabs screenProps={{navigation: this.props.navigation}}/>
        )
    }
}

export default MainAppContainer;