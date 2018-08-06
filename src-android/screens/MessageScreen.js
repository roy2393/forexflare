import React from 'react';
import { 
        Text, 
        View,
        Button,
        SafeAreaView
    } from 'react-native';
import * as rssParser from 'react-native-rss-parser';
import styles from '../styles/styles';
import firebase from 'react-native-firebase';

class MessageScreen extends React.Component{

    constructor(props){
        super(props);
        console.log('props - ', props);
    }
        
    getFeed(){
        return fetch('http://forexflares.com/feed/?limit=15')
            .then((response) => response.text())
            .then((responseData) => rssParser.parse(responseData))
            .then((rss) => {
                console.log(rss);
                console.log(rss.title);
                console.log(rss.items.length);
            });
    }

    signOut(){
        firebase.auth().signOut().then(() => {
            console.log('Signout Complete - ');
            this.props.screenProps.navigation.navigate('Auth');
        });
    }
    
    render(){
        this.getFeed();
        console.log('Main App Congainer', this.props);
        return (
            <SafeAreaView style={styles.safeArea}>
                
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ paddingTop: 30 }}>Account Setting Screen</Text>

                        <Button
                            onPress={() => this.signOut()}
                            title="Sign Out"
                            color="#841584"
                            accessibilityLabel="Logout Button"
                            />
                    </View>
            </SafeAreaView>
        )
    }
}

export default MessageScreen;