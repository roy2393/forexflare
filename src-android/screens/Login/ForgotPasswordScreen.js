import React from 'react';
import {  AsyncStorage, Text, TextInput, View, Button } from 'react-native';
import styles from '../../styles/styles'
import AppConst from '../../../utils/AppConstants';

export default class ForgotPassword extends React.Component {
    static navigationOptions = AppConst.NAVIGATION_OPTIONS;

    constructor(props){
        super(props);
        this.state = {  
                        id: '', 
                        password: '', 
                        error: null,
                        confirmPassword: ''
                    };

        // this.onPressLearnMore = this.onPressLearnMore.bind(this);
    }

    _signInAsync = async () => {
        if(this.state.id == 1 && this.state.password == 1){
            await AsyncStorage.setItem('userToken', 'abc');

            this.props.navigation.navigate('App');

        } else {
            this.setState({
                error: "Invalid username or password!"
            })
        }
        console.log('Sign in - ',AsyncStorage.getItem('userToken'));
    };

    render(){
        return (
            <View style={{ flex: 1, backgroundColor: '#6a51ae' }}>
                <View style={styles.inputGroup}>
                    <TextInput
                        style={styles.formControl}
                        placeholder="Email/Phone Number"
                        onChangeText={(id) => this.setState({ id })}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Button
                        onPress={this._signInAsync}
                        title="Submit"
                        color="#841584"
                        accessibilityLabel="Forgot Password Button"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text>{this.state.error}</Text>
                </View>
            </View>
        )
    }
}
