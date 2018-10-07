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
// import styles from '../styles/styles';
import firebase from 'react-native-firebase';
import consts from '../../utils/AppConstants';
import * as api from '../../utils/api'

const EMPTY_MSG = "You've not received any message yet!"

class MessageScreen extends React.Component{
    constructor(props){
        super(props);

        this.unsubscribe =  ()=>{};

        this.state = {
            userId: null,
            messages: [],
            loading: true
        }
        console.log('Message screen called - ');

        this._retrieveUserId = this._retrieveUserId.bind(this)
    }

    _retrieveUserId = async () => {
        try {
          const userId = await AsyncStorage.getItem(consts.userIdKey);
          if (userId !== null) {
            
            api.getUserDetail(userId).then(user => {
                if(user.data().isPaidUser){
                    this.ref = firebase.firestore().collection('paidMessages').where("timestamp", ">", new Date(user.data().signUpDate)).orderBy("timestamp", "asc");
                } else {
                    this.ref = firebase.firestore().collection('messages').where("timestamp", ">",  new Date(user.data().signUpDate)).orderBy("timestamp", "asc");
                }

                this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate) 
            })
            .catch(error => {
                console.log('Error - ', error);
            })
            
          }
         } catch (error) {
           // Error retrieving data
         }
      }

    componentDidMount() {
        this._retrieveUserId();
    }
    componentWillUnmount() {
        this.unsubscribe();
    }

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        console.log("querySnapshot - ", querySnapshot);
        querySnapshot.forEach((doc) => {
          const { message, timestamp } = doc.data();
          messages.push({
            key: doc.id,
            message,
            timestamp
          });
        });
        this.setState({ 
          messages,
          loading: false,
       });
    }

    renderMessages(){
        let messages = [];
        if(this.state.messages.length){
            messages =  this.state.messages;
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                    <FlatList
                        inverted
                        data={messages}
                        renderItem={({item}) => {
                            let date = new Date(item.timestamp);
                            return (
                            <View>
                                <View style={[styles.balloon,{backgroundColor: '#f5f5f5'}]}>
                                    <Text style={styles.messageTxt}>{item.message}</Text>
                                </View>
                                <Text style={styles.messageDate}>{date.toDateString() + ", "+ date.toLocaleTimeString()}</Text>
                            </View>
                            )}
                        }
                    />
                </View>
            )
        } else{
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>{EMPTY_MSG}</Text>
                </View>
            )
        }

    }

    render(){
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
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 15,
        marginBottom: 5,
        marginTop:10
     },
    messageTxt: {
        color: '#222',
        fontSize: 16,
    },
    messageDate: {
        color: '#ccc',
        fontSize: 11,
        marginBottom: 10,
        marginLeft: 15
    },
    safeArea: { 
        flex: 1, 
        backgroundColor: '#fff',
        paddingLeft: 10,
        paddingRight: 10
     }

});

export default MessageScreen;