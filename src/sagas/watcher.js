import { takeLatest } from 'redux-saga/effects';
import { coursesSaga } from './coursesSaga';
import * as types from '../app-constant';

// Watches for JOIN_COURSE action type asynchronously
export default function* watchSearchMedia() {
  yield takeLatest(types.Course_Join, coursesSaga);
}