import React from 'react';
import { render } from 'react-dom';
import { Provider} from 'react-redux';
import { HashRouter } from 'react-router-dom'
import store from './store'
import Root from './router'
import './app.css';


render(
  <HashRouter>
    <Provider store={store}>
      <Root />
    </Provider>
  </HashRouter>, 
  document.getElementById('root'));
