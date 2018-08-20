import React from 'react';
import { 
    StyleSheet,
        Text, 
        View,
        ListView,
        ActivityIndicator,
        Image,
        Linking
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
            dataSource: null,
            isLoading: true,
            isLoadingMore: false,
            _data: null,
            _nextPage: 0,
        };

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
        console.log("ADVORD - ", Banner, AdRequest, request.build());
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
          Linking.openURL(url).catch(err => console.error('An error occurred', err));
        } catch(err){
          console.log("Error opening article - ", err);
        }
      }

      render() {
        if (this.state.isLoading) {
          return (
            <View style={styles.container}>
              <ActivityIndicator size="large" />
            </View>
          );
        } else {
          return (
          <View>
            <Banner
              unitId={AppConstants.ADMOB_UNIT_ID}
              size={"LARGE_BANNER"}
              request={request.build()}
              onAdLoaded={() => {
                console.log('Advert loaded');
              }}
            />
            <ListView
              dataSource={this.state.dataSource}
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
          </View>
          );
        }
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