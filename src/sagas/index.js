import { fork } from 'redux-saga/effects';
import watchCoursesSaga from './watcher';

// Here, we register our watcher saga(s) and export as a single generator 
export default function* startForman() {
  yield fork(watchCoursesSaga);
}