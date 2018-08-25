import React from 'react';
import {
    View,
    WebView,
    TouchanbleOpacity,
    Text,
    ActivityIndicator
} from 'react-native';
import AppConst from '../../utils/AppConstants';

const BackButton = ({navigation}) => 
    <TouchanbleOpacity onPress={() => {
        navigation.goBack()
    }}>
    <Text>&lt; Back</Text>
    </TouchanbleOpacity>
class Browser extends React.Component{

    constructor(props){
        super(props);
        console.log("Browser - ", props);
        this.state = {
            webviewLoaded: false
        };
    }
    static navigationOptions = ({navigation}) => ({
        ...AppConst.NAVIGATION_OPTIONS
    })


    ActivityIndicatorLoadingView() {
        
        return (
     
          <ActivityIndicator
            color='#009688'
            size='large'
            style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center'
              
            }}
          />
        );
      }
    render(){

        let removeHeader = `
            document.getElementById("header").style.display = "none";
    `;
        return(
            <View style={{flex:1}}>
                <WebView source={{
                    uri: this.props.navigation.state.params.uri
                }} 
                injectedJavaScript={removeHeader}
                javaScriptEnabledAndroid={true}
                renderLoading={this.ActivityIndicatorLoadingView} 
                startInLoadingState={true}  
                style ={{flex:1}}/>
            </View>
        )
    }
}



export default Browser;