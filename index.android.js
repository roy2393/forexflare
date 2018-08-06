import React from 'react';
import { 
        View
    } from 'react-native';


import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import SignInScreen from './src-android/screens/Login/SignInScreen';
import SignUpScreen from './src-android/screens/Login/SignUpScreen';
import ForgotPasswordScreen from './src-android/screens/Login/ForgotPasswordScreen';
import MainAppContainer from './src-android/containers/MainAppContainer';
import AuthLoadingScreen from './src-android/containers/AuthLoadingScreen';
import styles from './src-android/styles/styles';
import Firebase from './config/firebase';

const AppStack = createStackNavigator(
    {
        MainApp: {
            screen: MainAppContainer,
        }
    }
);
const AuthStack = createStackNavigator(
    { 
        SignIn: SignInScreen, 
        SignUp: SignUpScreen, 
        ForgotPass: ForgotPasswordScreen 
    });

const Switch = createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        App: AppStack,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'AuthLoading',
    }
);

export default class App extends React.Component {
    constructor(props){
        super(props);
        // Firebase.initialise();
    }

    render(){
        console.log('render called');

        return (
            // <Provider store={store}>
                <View style={styles.container}>
                    <Switch />
                </View>
            // </Provider>
        )
    }
}