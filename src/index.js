import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect, Switch, BrowserRouter as Router, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Main from './containers/Main';
import Trains from './containers/Trains';
import Booking from './containers/Booking';
import Payment from './containers/Payment';
import Tickets from './containers/Tickets';
import * as serviceWorker from './serviceWorker';
import authReducer from './reducers/authReducer';
import { Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import setAuthToken from './utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import {setCurrentUser, logoutUser} from './actions/authActions';

const rootReducer = combineReducers({auth: authReducer});
const store = createStore(rootReducer, applyMiddleware(logger, thunk));
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // Redirect to login
    window.location.href = "./";
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store} >
      <Router>
        <Switch>
          <Route exact path='/' component={Main} />
          <Route path='/trains' component={Trains} />
          <Route path='/bookTickets' component={Booking} />
          <Route path='/viewTickets' component={Tickets} />
          <Route path='/payment' component={Payment} />
          <Route path="*" render={() => <Redirect to='/' />} />
        </Switch>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
