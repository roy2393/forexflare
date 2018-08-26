import React from 'react';
import { AsyncStorage, Text, TextInput, View, Button } from 'react-native';
import styles from '../../styles/styles'
import AppConst from '../../../utils/AppConstants';

export default class LoginForm extends React.Component {
    static navigationOptions = AppConst.NAVIGATION_OPTIONS;

    constructor(props){
        super(props);
        console.log('Singup props - ', props);
        this.state = {  
                        id: '', 
                        password: '', 
                        error: null,
                        confirmPassword: ''
                    };

        // this.onPressLearnMore = this.onPressLearnMore.bind(this);
    }

    _signUpAsync = async () => {
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
                    <TextInput
                        style={styles.formControl}
                        placeholder="Password"
                        secureTextEntry={true}
                        onChangeText={(password) => this.setState({ password })}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <TextInput
                        style={styles.formControl}
                        placeholder="Confirm Password"
                        secureTextEntry={true}
                        onChangeText={(password) => this.setState({ confirmPassword })}
                    />
                </View>
                
                <View style={styles.inputGroup}>
                    <Button
                        onPress={this._signInAsync}
                        title="Sign Up"
                        color="#841584"
                        accessibilityLabel="Sign Up Button"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text>{this.state.error}</Text>
                </View>
            </View>
        )
    }
}
