import { put, call } from 'redux-saga/effects';
import { passwordValidation } from '../api/api';
import * as types from '../app-constant';

export function* coursesSaga({ payload }) {
  try {
    const password = yield call(passwordValidation, payload)
    yield put ( {type: types.Course_Join_Success, payload: password} )
  } catch (error) {
    yield put({ type: types.Course_Join_Fail, payload: error.message });
  }
}
