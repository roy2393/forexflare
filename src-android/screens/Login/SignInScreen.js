import React from 'react';
import { 
        Text, 
        TextInput, 
        View, 
        Button,
        TouchableHighlight
    } from 'react-native';
import styles from '../../styles/styles';
import AppConst from '../../../utils/AppConstants';
import firebase from 'react-native-firebase';

export default class LoginForm extends React.Component {
    static navigationOptions = AppConst.NAVIGATION_OPTIONS;

    constructor(props) {
        super(props);
        this.unsubscribe = null;
        this.state = {
          user: null,
          message: '',
          codeInput: '',
          phoneNumber: '+91',
          confirmResult: null,
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
            // User has been signed out, reset the state
            this.setState({
              user: null,
              message: '',
              codeInput: '',
              phoneNumber: '+91',
              confirmResult: null,
            });
          }
        });
      }
    
      componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
     }
   
     signIn = () => {
       const { phoneNumber } = this.state;
       this.setState({ message: 'Sending code ...' });
   
       firebase.auth().signInWithPhoneNumber(phoneNumber)
         .then(confirmResult => this.setState({ confirmResult, message: 'Code has been sent!' }))
         .catch(error => this.setState({ message: `Sign In With Phone Number Error: ${error.message}` }));
     };

     confirmCode = () => {
        const { codeInput, confirmResult } = this.state;
    
        if (confirmResult && codeInput.length) {
          confirmResult.confirm(codeInput)
            .then((user) => {
              this.setState({ message: 'Code Confirmed!' });

              setTimeout(() => {
                this.props.navigation.navigate('App');
             }, 0)
            })
            .catch(error => this.setState({ message: `Code Confirm Error: ${error.message}` }));
        }
      };


      renderPhoneNumberInput() {
        const { phoneNumber } = this.state;
     
         return (
           <View style={{ padding: 25 }}>
             <Text>Enter phone number:</Text>
             <TextInput
               autoFocus
               style={{ height: 40, marginTop: 15, marginBottom: 15 }}
               onChangeText={value => this.setState({ phoneNumber: value })}
               placeholder={'Phone number ... '}
               value={phoneNumber}
             />
             <Button title="Sign In" color="green" onPress={this.signIn} />
           </View>
         );
       }

    renderMessage() {
        const { message } = this.state;
    
        if (!message.length) return null;
    
        return (
          <Text style={{ padding: 5, backgroundColor: '#000', color: '#fff' }}>{message}</Text>
        );
      }
     
      renderVerificationCodeInput() {
        const { codeInput } = this.state;
    
        return (
          <View style={{ marginTop: 25, padding: 25 }}>
            <Text>Enter verification code below:</Text>
            <TextInput
              autoFocus
              style={{ height: 40, marginTop: 15, marginBottom: 15 }}
              onChangeText={value => this.setState({ codeInput: value })}
              placeholder={'Code ... '}
              value={codeInput}
            />
            <Button title="Confirm Code" color="green" onPress={this.confirmCode} />

            <Text style={{color: 'blue'}}
                onPress={() => {this.setState({confirmResult: false})}}>
            Go Back
          </Text>
          </View>
        );
      }

      render() {
        const { user, confirmResult } = this.state;
        return (
          <View style={{ flex: 1 }}>
    
            {!user && !confirmResult && this.renderPhoneNumberInput()}
    
            {this.renderMessage()}
    
            {!user && confirmResult && this.renderVerificationCodeInput()}
    
          </View>
        );
      }
}
