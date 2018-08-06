import React from 'react';
import {
    ActivityIndicator,
    StatusBar,
    View,
} from 'react-native';
import firebase from 'react-native-firebase';

export default class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        };
    }

    componentDidMount() {
        this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            this.setState({ user: user.toJSON() });
            setTimeout(() => {
                this.props.navigation.navigate('App');
             }, 0)
          } else {
            setTimeout(() => {
                this.props.navigation.navigate('Auth');
             }, 0)
          }
        });
      }
    
    componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
     }

    // Fetch the token from storage then navigate to our appropriate place
    // _bootstrapAsync = async () => {
    //     const userToken = await AsyncStorage.getItem('userToken');
    //     console.log('UserToken -- ', userToken);
    //     // This will switch to the App screen or Auth screen and this loading
    //     // screen will be unmounted and thrown away.
    //     // this.props.navigation.navigate(userToken ? 'App' : 'Auth');
    //     this.props.navigation.navigate('Auth');
    // };

    // Render any loading content that you like here
    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}