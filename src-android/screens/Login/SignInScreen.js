import React from 'react';
import { 
        Text, 
        TextInput, 
        View, 
        Button,
        StyleSheet,
        Image,
        AsyncStorage,
        TouchableOpacity
    } from 'react-native';
import PhoneInput from 'react-native-phone-input'
import consts from '../../../utils/AppConstants';
import firebase from 'react-native-firebase';
import colors from '../../../utils/colors';
import * as api from '../../../utils/api'
import MessageToast from '../../components/MessageToast'

export default class LoginForm extends React.Component {
  static navigationOptions = {
    header: null,
    };

    constructor(props) {
        super(props);
        this.unsubscribe = null;
        this.state = {
          user: null,
          messageType: null,
          messageText: '',
          messageDisplayTime: null,
          codeInput: '',
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
              message: {},
              codeInput: '',
              confirmResult: null,
            });
          }
        });
      }
    
      componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
     }

     removeMessage(time){
      setTimeout(()=> {
        this.setState({ messageType: null, messageText: null})
      }, time ? time : 3000)
     }

     setUserCredentials = async (phoneNumber) => {
      try {
        await AsyncStorage.setItem(consts.userIdKey, phoneNumber);
        this.props.navigation.navigate('App');
      } catch (error) {
        // Error saving data
      }
    }
   
     signIn = () => {
       const phoneNumber = this.phone.state.formattedNumber;
       this.setState({ messageType: 'ongoing', messageText: 'Sending OTP code on '+ phoneNumber });
   
       firebase.auth().signInWithPhoneNumber(phoneNumber)
         .then(confirmResult => {
            this.setState({ confirmResult, messageType: 'success', messageText: 'Code Sent!'})
            
            this.removeMessage(3000)
          })
         .catch((error) => {
           console.log("Error - ", error, error.message);
            this.setState({ messageType: 'error', messageText: `Sign In With Phone Number Error: ${error.message}`})
          });
     };

     confirmCode = () => {
        const { codeInput, confirmResult } = this.state;
        
        if (confirmResult && codeInput.length) {
          confirmResult.confirm(codeInput)
          .then((user) => {
            this.setState({ user ,messageType: 'success', messageText: 'Code Confirmed!'});
            
              api.updateUserDetail(user.phoneNumber).then(userExist => {
                this.setUserCredentials(user.phoneNumber)
              })
              .catch(error => {
                console.log('Transaction failed: ', error);
              });
            })
            .catch(error => {
              this.setState({ messageType: 'error', messageText: `Code Confirm Error: ${error.message}`})
            });
        }
      };


      renderPhoneNumberInput() {
         return (
           <View style={styles.inputContainer}>
             <Text style={styles.label}>Enter phone number:</Text>
             
             <PhoneInput style={styles.phoneInput}
              initialCountry='in'
              ref={ref => {
                this.phone = ref;
              }}
            />
             <TouchableOpacity activeOpacity={0.5} style={[styles.button, styles.signIn]} onPress={this.signIn}>
              <Text style={styles.btnText}>Sign In</Text>
             </TouchableOpacity>
           </View>
         );
       }

    renderMessage() {
        const { message } = this.state;
    
        if (!message.length) return null;
    
        return (
          <Text style={{padding: 10, backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', textAlign: 'center'}}>{message}</Text>
        );
      }
     
      renderVerificationCodeInput() {
        const { codeInput } = this.state;
    
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Enter OTP:</Text>
            <TextInput
              autoFocus
              keyboardType="number-pad"
              style={[styles.inputBox, styles.otpInput]}
              onChangeText={value => this.setState({ codeInput: value })}
              placeholder={'Code ... '}
              value={codeInput}
            />
            <TouchableOpacity activeOpacity={0.5} style={[styles.button, styles.signIn]} onPress={this.confirmCode}>
              <Text style={styles.btnText}>Verify</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.5}>
              <Text style={styles.goBackBtn} onPress={() => {this.setState({confirmResult: false})}}>
                Go Back
              </Text>
            </TouchableOpacity>
          </View>
        );
      }

      render() {
        const { user, confirmResult } = this.state;
        return (
          <View style={styles.container}>
            <View style={styles.msgBox}>
              <MessageToast messageType={this.state.messageType} messageText={this.state.messageText} messageDisplayTime={this.state.messageDisplayTime}/>
            </View>

            <Image source={require('../../../assets/img/logo.png')} style={styles.logo}/>

            {!user && !confirmResult && this.renderPhoneNumberInput()}
    
    
            {!user && confirmResult && this.renderVerificationCodeInput()}

              <Image source={require('../../../assets/img/trading.png')} style={styles.bgPattern}/>
          </View>
        );
      }
}

const styles = StyleSheet.create({
  container: {
     flex: 1,
     width: '100%', 
     height: '100%',
     alignItems: 'center'
  },
  label: {
    marginBottom: 20,
    fontSize: 14,
    textAlign: 'center'
  },
  inputBox:{
    marginBottom: 25,
    paddingBottom: 5,
    borderBottomWidth: 1 ,
    borderBottomColor: colors.inputBorder,
  },
  phoneInput:{
    width: 200, 
    marginBottom: 25,
    paddingBottom: 5,
    borderBottomWidth: 1 ,
    borderBottomColor: colors.inputBorder,
  },
  otpInput:{
    width: 200,
    fontSize: 14
  },
  logo:{
    marginTop: 100,
    marginBottom: 50
  },
  button:{
    backgroundColor: colors.defaultBlue,
    borderRadius: 40,
    padding: 10,
  },
  signIn:{
    
  },
  btnText:{
    color: colors.white,
    fontSize: 14,
    textAlign: 'center'

  },
  msgBox:{
    width: '100%',
    height: 50,
    marginTop: 0
  },
  inputContainer:{

  },
  goBackBtn:{
    marginTop: 20, 
    fontSize: 14, 
    color: colors.defaultBlue, 
    textAlign: 'center'
  },
  bgPattern:{
    marginTop: 20,
    opacity: 0.2
  }
})
