
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import * as userApi from'./actions/course'

function* getUserSaga({sendData}) {
    try {
       const result = yield call(userApi.getUserAPI, sendData);
       yield put({type: "GET_SUCCESS", payload: result.data.users});
    }  catch (err) {
       yield put({type: "GET_ERROR", payload: err.message});
    }
 }

 function* rootSaga() {

    yield takeLatest("RECEIVE_GET_SUCCESS", getUserSaga)
  
  }
   
  export default rootSaga;