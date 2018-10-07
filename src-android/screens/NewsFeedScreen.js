import React from 'react';
import { 
    StyleSheet,
        Text, 
        View,
        ListView,
        ActivityIndicator,
        Image,
        RefreshControl
    } from 'react-native';
import * as rssParser from 'react-native-rss-parser';
import firebase from 'react-native-firebase';
import AppConstants from '../../utils/AppConstants';

const Banner = firebase.admob.Banner;
const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest();
request.addKeyword('foobar');

const thumbnail = 'http://forexflares.com/wp-content/uploads/2018/06/forexflares-65x65.png';
class NewsFeedScreen extends React.Component{

    constructor(props){
        super(props);
        this.fetchMore = this._fetchMore.bind(this);
        this.fetchData = this._fetchData.bind(this);
        this.state = {
            dataSource: new ListView.DataSource({
              rowHasChanged: (r1, r2) => r1 !== r2,
            }),
            isLoading: true,
            isLoadingMore: false,
            _data: null,
            _nextPage: 0,
        };

    }

    _onRefresh = () => {
      this.setState({isLoading: true});
      this.fetchData(() => {
        this.setState({isLoading: false});
      });
    }

    _fetchData(callback) {
        const params = this.state._nextPage
          ? `?paged=${this.state._nextPage}`
          : '';
        //Limits fetches to 15 so there's lesser items from the get go
        fetch(`http://forexflares.com/feed/${params}`)
          .then(response => response.text())
          .then((responseData) => rssParser.parse(responseData))
          .then(callback)
          .catch(error => {
            console.error(error);
          });
    }

    _fetchMore() {
        this.fetchData(responseJson => {
          
          const data = this.state._data.concat(responseJson.items);
          const _nextPage = this.state._nextPage + 1;
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(data),
            isLoadingMore: false,
            _data: data,
            _nextPage: _nextPage,
          });
        });
    }

    componentDidMount() {
        //Start getting the first batch of data from froex flares
        this.fetchData(responseJson => {
          // console.log("Response data - ", responseJson);
          let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
          });
          const data = responseJson.items;
          const _nextPage = this.state._nextPage + 1;
          this.setState({
            dataSource: ds.cloneWithRows(data),
            isLoading: false,
            _data: data,
            _nextPage: _nextPage,
          });
        });
      }
      _openArticleLink(article){
        try{
          let url = Array.isArray(article.links) && article.links.length ? article.links[0].url : article.id;
          // Linking.openURL(url).catch(err => console.error('An error occurred', err));
          console.log("Open link 0 ", this.props);
          this.props.screenProps.navigation.navigate('Browser', {uri: url});
        } catch(err){
          console.log("Error opening article - ", err);
        }
      }

      render() {
        let LOADING_VIEW = (
          <View style={styles.container}>
              <ActivityIndicator size="large" />
            </View>
        )


        let FEED = (
          <ListView
          dataSource={this.state.dataSource}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          renderRow={rowData => {
            return (
              <View style={styles.listItem}>
                <View style={styles.imageWrapper}>
                  <Image
                    style={{ width: 70, height: 70 }}
                    source={{
                      uri: rowData.icon_img &&
                        rowData.icon_img !== ''
                        ? rowData.icon_img
                        : thumbnail,
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title} onPress={() => this._openArticleLink(rowData)}>
                    {rowData.title}
                  </Text>
                  <Text style={styles.subtitle}>
                    {rowData.description}
                  </Text>
                </View>
              </View>
            );
          }}
          onEndReached={() =>
            this.setState({ isLoadingMore: true }, () => this.fetchMore())}
          renderFooter={() => {
            return (
              this.state.isLoadingMore &&
              <View style={{ flex: 1, padding: 10 }}>
                <ActivityIndicator size="small" />
              </View>
            );
          }}
        />
        )

        return(
          <View style={{flex: 1}}>
            <Banner
              unitId={AppConstants.ADMOB_UNIT_ID}
              size={"SMART_BANNER"}
              style={{width:'100%'}}
              request={request.build()}
              onAdLoaded={() => {
                console.log('Ad');
              }}
            />

            {this.state.isLoading ? LOADING_VIEW: FEED}

          </View>
          );
        }
      }

    
const styles = StyleSheet.create({
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
        padding: 6
      },
      listItem: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#d6d7da',
        backgroundColor: '#fff',
        padding: 6,
      },
      imageWrapper: {
        padding: 5,
      },
      title: {
        fontSize: 20,
        textAlign: 'left',
        margin: 6,
        color: '#3498db'
      },
      subtitle: {
        fontSize: 10,
        textAlign: 'left',
        margin: 6,
      },
});
    

export default NewsFeedScreen;