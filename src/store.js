import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase'
import * as firebase from 'firebase';
import rootSaga from './sagas/';
// import reducers
import reducers from './reducers/';

// import middleware
import {firebaseLogger} from './helpers/'

// firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCaXBvH4LEAO7fP7LNMMol1W8V9J8Fah8A",
  authDomain: "jupyter-dev.firebaseapp.com",
  databaseURL: "https://jupyter-dev.firebaseio.com",
  projectId: "jupyter-dev",
  storageBucket: "jupyter-dev.appspot.com",
  messagingSenderId: "700109501520"
};
firebase.initializeApp(firebaseConfig);
const config = {
  userProfile: 'users',
  enableLogging: false,
  attachAuthIsReady: true,
}

const createStoreWithFirebase = composeWithDevTools(
  reactReduxFirebase(firebase, config),
)(createStore)


const sagaMiddleware = createSagaMiddleware();

const store = createStore( reducers, composeWithDevTools( reactReduxFirebase(firebase, config),applyMiddleware( firebaseLogger,sagaMiddleware)) )


export default store;
sagaMiddleware.run(rootSaga, getFirebase);