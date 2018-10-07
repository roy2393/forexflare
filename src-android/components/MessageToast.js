import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import colors from '../../utils/colors';


export default class MessageToast extends React.Component {

  constructor(props){
    super(props)
    console.log('props - ', props);
    this.state = {
      messageType: props.messageType,
      messageText: props.messageText
    }
  }

  componentWillReceiveProps(props){
    console.log('props received - ', props, this.hideToast);
    this.setState({
      messageType: props.messageType,
      messageText: props.messageText
    })
  }
  render(){
    if(!this.state.messageText || !this.state.messageText){
      return null
    }
    return (
      <Text style={[styles[this.props.messageType] ? styles[this.props.messageType] : styles.default,styles.text]}>{this.state.messageText}</Text>
    )
  }

}

const styles = StyleSheet.create({
  default:{
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  error: {
    backgroundColor: colors.errorBg
  },
  success: {
    backgroundColor: colors.successBg
  },
  ongoing: {
    backgroundColor: colors.ongoingBg
  },
  text: {
    fontSize: 12,
    color: colors.white,
    padding: 5,
    textAlign: 'center'
  }
})