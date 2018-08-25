import React from 'react';
import { 
        Text, 
        View,
        Button
    } from 'react-native';
import { DrawerNavigator, StackNavigator } from 'react-navigation';
import DrawerContent from "../components/DrawerContent"
import Browser from "../components/Browser";
import AppConst from '../../utils/AppConstants';
import AppTabs from './AppTabs';
import firebase from 'react-native-firebase';



const InnerStackNavigator = StackNavigator(
    {
        TabNavigator: {
            screen: AppTabs,
        },
        Browser: {screen: Browser}
    }
);

const Drawer = DrawerNavigator({
    Home: { screen: InnerStackNavigator}
  }, 
  {
    contentComponent: DrawerContent,
    drawerWidth: 250,
    drawerPosition: 'left',
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
  });

class MainAppContainer extends React.Component{

    // static navigationOptions = AppConst.NAVIGATION_OPTTIONS;
    static navigationOptions = {
        header: null,
        };

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
    // firebase.admob().openDebugMenu();
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
            <Drawer screenProps={{navigation: this.props.navigation}}/>
            // <AppTabs screenProps={{navigation: this.props.navigation}}/>
        )
    }
}

export default MainAppContainer;