import React from 'react';
import { 
        Text, 
        View,
        Button
    } from 'react-native';
import AppConst from '../../utils/AppConstants';
import AppTabs from './AppTabs';

class MainAppContainer extends React.Component{

    static navigationOptions = AppConst.NAVIGATION_OPTTIONS;
    
    render(){
        return (
            <AppTabs screenProps={{navigation: this.props.navigation}}/>
        )
    }
}

export default MainAppContainer;