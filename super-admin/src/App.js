import React, { Fragment, useEffect } from 'react';
import './App.css';
import { Route, Switch } from 'react-router';
import Login from './components/auth/Login/Login';
import PrivateRoute from './components/routing/PrivateRouter';
import setAuthToken from './utills/setAuthToken';
import { loadUser, startLoading } from './store/actions/auth';
import store from './store/store';
import MainContainer from './containers/MainContainer/MainContainer';

import Chartist from 'chartist';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/createForms/CreateProfile';
import AddEducation from './components/createForms/AddEducation';
import AddExperience from './components/createForms/AddExperience';
import EditProfile from './components/createForms/EditProfile';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profiles/Profile';

setAuthToken();
function App() {
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
        <PrivateRoute path="/" exact component={MainContainer} />
        <Route exact path="/login" component={Login} />
      </Switch>

      <MainContainer />

      <Route path="/" exact component={Landing} />

      <section className="container">
        <Alert />
        <Switch>
          <Route exact path="/add-education" component={AddEducation} />

          <Route exact path="/add-experience" component={AddExperience} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/profiles" component={Profiles} />
          <Route exact path="/profile/:id" component={Profile} />
          <PrivateRoute exact path="/dashboard" component={Dashboard} />

          <PrivateRoute
            exact
            path="/create-profile"
            component={CreateProfile}
          />

          <PrivateRoute exact path="/edit-profile" component={EditProfile} />
        </Switch>
      </section>
    </Fragment>
  );
}

export default App;
