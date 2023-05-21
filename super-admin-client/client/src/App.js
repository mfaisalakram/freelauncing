import React, { Fragment, useEffect } from 'react';

import Chartist from 'chartist';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import { Route, Switch } from 'react-router';
import Login from './components/auth/Login/Login';
import Register from './components/auth/Register';
import Alert from './components/layout/Alert';

import PrivateRoute from './components/routing/PrivateRouter';
import setAuthToken from './utills/setAuthToken';
import { loadUser, startLoading } from './store/actions/auth';
import store from './store/store';

import MainContainer from './containers/MainContainer/MainContainer';
import AllUsers from './components/AllUsers/AllUsers';
import ServiceManagement from './components/ServiceManagement/ServiceManagement';
import Layout from './components/layout/Layout';
import ServicesReport from './components/ServicesReport/ServicesReport';
import PaymentMethod from './components/PaymentMethod/PaymentMethod';

setAuthToken();

function App(props) {
  useEffect(() => {
    store.dispatch(startLoading());
    store.dispatch(loadUser());
  }, []);

  // new Chartist.Line(
  //   '.kit__c11__chart', {
  //     series: [{
  //       class: 'ct-series-a',
  //       data: [2, 11, 8, 14, 18, 20, 26],
  //     }, ],
  //   }, {

  //   },
  // )

  return (
    <Fragment>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/dashboard" exact component={MainContainer} />
        <Route
          exact
          path="/all-users"
          render={(props) => (
            <Layout>
              <AllUsers {...props} />
            </Layout>
          )}
        />
        <Route
          exact
          path="/service-management"
          render={(props) => (
            <Layout>
              <ServiceManagement {...props} />
            </Layout>
          )}
        />
        <Route
          exact
          path="/services-report"
          render={(props) => (
            <Layout>
              <ServicesReport {...props} />
            </Layout>
          )}
        />
        <Route
          exact
          path="/payment-method"
          render={(props) => (
            <Layout>
              <PaymentMethod {...props} />
            </Layout>
          )}
        />
      </Switch>
    </Fragment>
  );
}

export default App;
