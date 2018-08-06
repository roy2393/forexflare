import * as firebase from "react-native-firebase";
import * as CONSTANTS from './constants';


class Firebase {
    static initialise() {
        try{
            firebase.initializeApp({
                apiKey: CONSTANTS.FIREBASE_API_KEY,
                authDomain: CONSTANTS.FIREBASE_AUTH_DOMAIN,
                databaseURL: CONSTANTS.FIREBASE_DATABASE_URL,
                storageBucket: CONSTANTS.FIREBASE_STORAGE_BUCKET,
                projectId: CONSTANTS.FIREBASE_PROJECT_ID
            });
        } catch(e){
            console.log("Error in initialising firebase - ", e);
        }
    }
}

module.exports =  Firebase;