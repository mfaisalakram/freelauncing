import React, { Fragment, useEffect } from 'react';
import './App.css';
import { Route, Switch, Redirect } from 'react-router';
import Login from './components/auth/Login';
import Forget from './components/auth/Forget';
import { loadUser, startLoading } from './store/actions/auth';
import store from './store/store';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home/Home';
import AddService from './pages/AddService/AddService';
import EditService from './pages/EditService/EditService';
import Alert from './components/layout/Alert';
import Join from './components/auth/Join';
import { ToastProvider } from 'react-toast-notifications';
import Toast from './components/layout/Toast';
import Services from './pages/Services/Services';
import ViewService from './pages/ViewService/ViewService';
import EditProfile from './pages/EditProfile/EditProfile';
import BuyerSearch from './pages/BuyerSearch/BuyerSearch';
import PrivateRoute from './components/routing/PrivateRouter';
import ChatBox from './components/ChatContainer/ChatBox/ChatBox';
import ViewOffer from './pages/ViewOffer/ViewOffer';
import NewPayment from './pages/NewPayment/NewPayment';
import Orders from './pages/Orders/Orders';
import ViewOrderSeller from './pages/ViewOrderSeller/ViewOrderSeller';
import ResolutionCenter from './pages/ResolutionCenter/ResolutionCenter';
import BuyerOrders from './pages/BuyerOrders/BuyerOrders';
import ViewOrderBuyer from './pages/ViewOrderBuyer/ViewOrderBuyer';
import BecomeASeller from './pages/BecomeASeller/BecomeASeller';
function App(props) {
  const baseUrl = 'http://localhost:5000';
  useEffect(() => {
    store.dispatch(startLoading());
    store.dispatch(loadUser());
  }, []);

  return (
    <Fragment>
      <div className="App">
        <ToastProvider>
          <Header />
          <Alert />
          <Toast />
          <div className="parent-container">
            <Switch>
              <PrivateRoute
                path="/messages"
                render={(props) => <ChatBox {...props} baseUrl={baseUrl} />}
              />

              <PrivateRoute
                path="/services/edit"
                render={(props) => <EditService {...props} baseUrl={baseUrl} />}
              />
              <PrivateRoute
                exact
                path="/add-service"
                render={(props) => <AddService {...props} baseUrl={baseUrl} />}
              />

              <PrivateRoute
                exact
                path="/payments/new/"
                render={(props) => <NewPayment {...props} baseUrl={baseUrl} />}
              />

              <PrivateRoute
                exact
                path="/edit-profile"
                render={(props) => <EditProfile {...props} baseUrl={baseUrl} />}
              />

              <PrivateRoute
                exact
                path="/view-offer-details/:seller/:offerId"
                render={(props) => <ViewOffer {...props} baseUrl={baseUrl} />}
              />

              <PrivateRoute
                exact
                path="/resolution-center/:id"
                render={(props) => (
                  <ResolutionCenter {...props} baseUrl={baseUrl} />
                )}
              />

              <PrivateRoute
                exact
                path="/users/:username/manage_orders/:orderId"
                render={(props) => (
                  <ViewOrderSeller {...props} baseUrl={baseUrl} />
                )}
              />
              <PrivateRoute
                exact
                path="/users/:username/orders/:orderId"
                render={(props) => (
                  <ViewOrderBuyer {...props} baseUrl={baseUrl} />
                )}
              />
              <PrivateRoute
                exact
                path="/services"
                render={(props) => <Services {...props} baseUrl={baseUrl} />}
              />

              <PrivateRoute
                exact
                path="/orders"
                render={(props) => <Orders {...props} baseUrl={baseUrl} />}
              />

              <PrivateRoute
                exact
                path="/my-orders"
                render={(props) => <BuyerOrders {...props} baseUrl={baseUrl} />}
              />

              <Route
                exact
                path="/reset"
                render={(props) => <Forget {...props} baseUrl={baseUrl} />}
              />
              <PrivateRoute
                exact
                path="/aggrement/selling-on-eaglance"
                render={(props) => (
                  <BecomeASeller {...props} baseUrl={baseUrl} />
                )}
              />

              <Route
                exact
                path="/"
                render={(props) => <Home {...props} baseUrl={baseUrl} />}
              />

              <Route
                exact
                path="/services/search"
                render={(props) => <BuyerSearch {...props} baseUrl={baseUrl} />}
              />
              <Route exact path="/login" baseUrl={baseUrl} component={Login} />
              <Route exact path="/join" baseUrl={baseUrl} component={Join} />
              <Route exact path="/login/:token" component={Login} />
              <Route
                exact
                path="/:username/service/:title"
                render={(props) => <ViewService {...props} baseUrl={baseUrl} />}
              />
            </Switch>
          </div>
          <Footer />
        </ToastProvider>
      </div>
    </Fragment>
  );
}

export default App;
