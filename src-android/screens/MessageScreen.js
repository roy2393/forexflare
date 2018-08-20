import React from 'react';
import { 
        Text, 
        View,
        Button,
        StyleSheet,
        SafeAreaView,
        FlatList,
        AsyncStorage
    } from 'react-native';
import * as rssParser from 'react-native-rss-parser';
// import styles from '../styles/styles';
import firebase from 'react-native-firebase';
import type { RemoteMessage } from 'react-native-firebase';
import type { Notification, NotificationOpen } from 'react-native-firebase';

const MSG_DELIMITER = ";"
const MSG_TIME_SEPARATOR = "@T:";
const MSG_KEY = '@ForexFlare:message';
const EMPTY_MSG = "You've not received any message yet!"
class MessageScreen extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            messages: "",
        }
    }
    encodeMessageData(message){
        return message+MSG_TIME_SEPARATOR+Date.now()+MSG_DELIMITER;
    }
    decodeMessageData(allMessages){
        let messages = allMessages.split(MSG_DELIMITER);
        let msgArr = [];
        messages.map((data, index) => {
            let val = data.split(MSG_TIME_SEPARATOR);
            let msg = val[0];
            let time = val[1];
            if(msg && time){
                msgArr.push({message: msg, timestamp: time });
            }
        })

        return msgArr;
    }
    _storeData = async (message) => {
        try {
          
          let allMessages = this.state.messages +this.encodeMessageData(message);
          await AsyncStorage.setItem(MSG_KEY, allMessages);
          this.setState({messages: allMessages});
        } catch (error) {
          // Error saving data
        }
    }
    
    _retrieveData = async () => {
        try {
          const value = await AsyncStorage.getItem(MSG_KEY);
          console.log("REtrieve data called - ", value);
          if (value !== null) {
            // We have data!!
            this.setState({messages: value});
          }
         } catch (error) {
           // Error retrieving data
           console.log("Error - ", error);
         }
    }
      
    async componentDidMount() {
        try {
            const value = await AsyncStorage.getItem(MSG_KEY);
            console.log("first fetch", value);
            if (value !== null) {
              // We have data!!
              this.setState({messages: value});
            }
           } catch (error) {
             // Error retrieving data
             console.log("Error - ", error);
        }

        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
            const action = notificationOpen.action;
            const notification: Notification = notificationOpen.notification;
            console.log("notification opened - ",  notificationOpen, notification);
            this._storeData(notification.data.message);

        });
        this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
            console.log('notificationListener - ',  notification);
            this._storeData(notification.data.message);

        });

       console.log("Initial notification");
        const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
        console.log("Initial notification", notificationOpen);
        if (notificationOpen) {
            // App was opened by a notification
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            // Get information about the notification that was opened
            const notification: Notification = notificationOpen.notification;
            this._storeData(notification.data.message);
        }

    }

    componentWillUnmount() {
        this.notificationOpenedListener();
        this.notificationListener();
       
    }

    signOut(){
        firebase.auth().signOut().then(() => {
            console.log('Signout Complete - ');
            this.props.screenProps.navigation.navigate('Auth');
        });
    }

    renderMessages(){
        let messages = [];
        if( this.state.messages){
            messages =  this.decodeMessageData(this.state.messages);
        } else{
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>{EMPTY_MSG}</Text>
                </View>
            )
        }

        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                <FlatList
                    data={messages}
                    renderItem={({item}) => {
                        console.log("render - ",arguments);
                        let date = new Date(parseInt(item.timestamp));
                        return (
                        <View style={[styles.balloon,{backgroundColor: '#1084ff'}]}>
                            <Text style={styles.messageTxt}>{item.message}</Text>
                            <Text style={styles.messageDate}>{date.toDateString() + ", "+ date.toLocaleTimeString()}</Text>
                        </View>
                        )}
                    }
                />
            </View>
        )
    }
    
    render(){
        console.log('Main App Congainer', this.props);
        return (
            <SafeAreaView style={styles.safeArea}>
                
                
                        {this.renderMessages()}

                        

                        {/* <Button
                            onPress={() => this.signOut()}
                            title="Sign Out"
                            color="#841584"
                            accessibilityLabel="Logout Button"
                            /> */}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    balloon: {
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 15,
        borderRadius: 20,
        marginBottom: 20
     },
    messageTxt: {
        color: 'white',
        fontSize: 16,
    },
    messageDate: {
        color: '#ccc',
        fontSize: 12,
    },
    safeArea: { 
        flex: 1, 
        backgroundColor: '#fff',
        padding: 10
     }

});

export default MessageScreen;