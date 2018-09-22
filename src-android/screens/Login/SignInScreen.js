import React from 'react';
import { 
        Text, 
        TextInput, 
        View, 
        Button,
        StyleSheet,
        Image,
        ImageBackground,
        TouchableOpacity
    } from 'react-native';
import PhoneInput from 'react-native-phone-input'
import AppConst from '../../../utils/AppConstants';
import firebase from 'react-native-firebase';
import colors from '../../../utils/colors';

export default class LoginForm extends React.Component {
  static navigationOptions = {
    header: null,
    };

    constructor(props) {
        super(props);
        this.unsubscribe = null;
        this.state = {
          user: null,
          message: '',
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
              message: '',
              codeInput: '',
              confirmResult: null,
            });
          }
        });
      }
    
      componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
     }
   
     signIn = () => {
       const phoneNumber = this.phone.state.formattedNumber;
       this.setState({ message: 'Sending OTP code on '+ phoneNumber });

      //  setTimeout(()=>{
      //   this.setState({ confirmResult: true, message: 'Code has been sent!' })
      //   setTimeout(() => {
      //     this.setState({ message: '' })
      //   }, 3000)
      //  }, 1000);
   
       firebase.auth().signInWithPhoneNumber(phoneNumber)
         .then(confirmResult => {
          this.setState({ confirmResult, message: 'Code has been sent!' })
          setTimeout(() => {
            this.setState({ message: '' })
          }, 3000)
          })
         .catch((error) => {
           console.log("Error - ", error, error.message);
          this.setState({ message: `Sign In With Phone Number Error: ${error.message}` })
         } );
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
          <ImageBackground source={require('../../../assets/img/gradientBG.png')} style={styles.container}>

            <Image source={require('../../../assets/img/logo.png')} style={styles.logo}/>

            {!user && !confirmResult && this.renderPhoneNumberInput()}
    
    
            {!user && confirmResult && this.renderVerificationCodeInput()}
            <View style={styles.msgBox}>
              {this.renderMessage()}  
            </View>

          </ImageBackground>
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
    backgroundColor: 'rgba(0,0,0,0.3)',
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
    marginTop: 50
  },
  inputContainer:{

  },
  goBackBtn:{
    marginTop: 20, 
    fontSize: 14, 
    color: colors.white, 
    textAlign: 'center'
  }
})
