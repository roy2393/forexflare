import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation';
import NewsFeed from '../screens/NewsFeedScreen';
import Messages from '../screens/MessageScreen';
import * as AppConst from '../../utils/AppConstants';

export const TabNav = createMaterialTopTabNavigator({
    NewsFeed: { screen: NewsFeed, tabBarLabel: "News Feed" },
    Messages: { screen: Messages, tabBarLabel: "Messages" }
});

class AppTab extends React.Component{
    static navigationOptions = ({ navigation }) => {
        return {
            ...AppConst.NAVIGATION_OPTIONS
        }
    }

    
    render(){
        return (
            <TabNav screenProps={{navigation: this.props.screenProps.navigation}}/>

        )
    }
}

export default AppTab;