import React, { useEffect, Fragment } from 'react';
import HomeCategorySection from '../../components/HomeCategorySection/HomeCategorySection';
import HomeBanner from '../../components/HomeBanner/HomeBanner';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { loadUser, startLoading } from '../../store/actions/auth';
import querySearch from 'stringquery';
import { setToast } from '../../store/actions/toast';
import SellerDashboard from '../SellerDashboard/SellerDashboard';
import BuyerSearch from '../BuyerSearch/BuyerSearch';
import eaglanceSpinner from '../../img/25.gif';
import './Home.css';

const Home = (props) => {
  const getKeyvalue = (k) => {
    const search = props.location.search;
    const query = querySearch(decodeURI(search));

    let stringQuery = [];
    let found = false;

    if (Object.keys(query).length > 0) {
      Object.keys(query).map((key) => {
        if (k === key) {
          found = true;
          stringQuery = query[key];
        }
      });
      if (found) {
        return stringQuery;
      } else {
        return '';
      }
    } else {
      return '';
    }
  };

  useEffect(() => {
    if (getKeyvalue('error')) {
      props.setToast([{ msg: getKeyvalue('error'), type: 'error' }]);
      props.history.push('/');
    }
    if (getKeyvalue('token')) {
      localStorage.setItem('userToken', getKeyvalue('token'));
      props.setToast([{ msg: 'login Successfully', type: 'success' }]);
      // props.history.push("/");
      window.location.href = '/';
    }
  }, []);

  let html = (
    <div>
      <img src={eaglanceSpinner} className="spinner-image" alt="" />;
    </div>
  );

  if (!props.loading) {
    if (props.isAuthenticated) {
      if (props.user.current_type === 'seller') {
        html = <SellerDashboard />;
      } else {
        html = <BuyerSearch {...props} />;
        return <Redirect to="/services/search" />;
      }
    } else {
      html = (
        <Fragment>
          <HomeBanner />
          <HomeCategorySection />
        </Fragment>
      );
    }
  } else {
  }

  return <Fragment>{html}</Fragment>;
};

const mapStatetoProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
  user: state.auth.user,
});
export default connect(mapStatetoProps, { loadUser, startLoading, setToast })(
  Home
);
