import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation';
import NewsFeed from '../screens/NewsFeedScreen';
import Messages from '../screens/MessageScreen2';
import AppConst from '../../utils/AppConstants';

export const TabNav = createMaterialTopTabNavigator({
    NewsFeed: { screen: NewsFeed, tabBarLabel: "News Feed" },
    Messages: { screen: Messages, tabBarLabel: "Messages" }
});

class AppTab extends React.Component{
    static navigationOptions = ({ navigation }) => {
        return {
            ...AppConst.NAVIGATION_OPTIONS,
            headerLeft: (
                <View style={{ padding: 10 }}>
                <TouchableOpacity activeOpacity = { .5 }  onPress={() =>  { console.log("open menu ", navigation); navigation.openDrawer()}}>
                    <Image
                       
                        style={styles.menu}
                        source={require('../../assets/img/menu.png')}
                    />
                    </TouchableOpacity>
                </View>
            )
        }
    }

    
    render(){
        return (
            <TabNav screenProps={{navigation: this.props.navigation}}/>

        )
    }
}
const styles = StyleSheet.create({
     menu:{
        width: 40,
        height: 40
     }
  
  });
export default AppTab;