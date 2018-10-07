import firebase from 'react-native-firebase';

export function getUserDetail(userId){
  return firebase
    .firestore()
    .runTransaction(async transaction => {
      let ref = firebase.firestore().collection('users').doc(userId)
      const doc = await transaction.get(ref);
      
      transaction.update(ref, {
        lastLogin: Date.now(),
      });
      
      return doc;
    })
} 
 
export function updateUserDetail(userId){
  return firebase
    .firestore()
    .runTransaction(async transaction => {
      let ref = firebase.firestore().collection('users').doc(userId)
      const doc = await transaction.get(ref);

      if (!doc.exists) {
        transaction.set(ref, { id: userId, signUpDate: Date.now(), isPaidUser: false, lastLogin: Date.now() });
        return false;
      }
  
      transaction.update(ref, {
        lastLogin: Date.now(),
      });

      return true;
    })
} 

