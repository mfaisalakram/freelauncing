import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from '../../axios-server';
import Spinner from '../../components/layout/Spinner';
import { loadUser, startLoading } from '../../store/actions/auth';
import { setToast } from '../../store/actions/toast';
import { getServices } from '../../store/actions/services';
import { Link } from 'react-router-dom';
import './Services.css';
// import $ from "jquery";
import Model from '../../components/layout/Model';
const Services = (props) => {
  const [counts, setCounts] = useState({});
  const [active, setActive] = useState('active');
  const [selectedId, setselectedId] = useState(-1);

  useEffect(() => {
    props.getServices('active', props.history);
    getCount();
  }, []);

  const getCount = () => {
    axios
      .get('/api/service/user/services/count')
      .then((response) => {
        if (response.data.error) {
        } else {
          if (response.data.found === true) {
            setCounts(response.data.data);
            console.log(response.data.data);
          }
        }
      })
      .catch((err) => {});
  };
  const onServiceTagClick = (e, tag) => {
    setActive(tag);
    props.getServices(tag, props.history);
  };

  const onPauseService = async (e, id) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    await axios
      .post('/api/service/pause', { id: id }, config)
      .then((response) => {
        console.log(response.data);

        props.getServices(active, props.history);
        getCount();
        props.setToast([response.data]);
      })
      .catch((err) => {});
  };
  const onActivateService = async (e, id) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    await axios
      .post('/api/service/active', { id: id }, config)
      .then((response) => {
        console.log(response.data);

        props.getServices(active, props.history);
        getCount();
        props.setToast([response.data]);
      })
      .catch((err) => {});
  };

  const onDeleteService = async (e, id) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    await axios
      .post('/api/service/delete', { id: id }, config)
      .then((response) => {
        console.log(response.data);

        props.getServices(active, props.history);
        getCount();
        props.setToast([response.data]);
      })
      .catch((err) => {});
  };

  let html = <Spinner />;
  if (props.loadingServices === false) {
    html = (
      <div className="tableOuter">
        {/* <div>
          <span>Active Service</span>
          <select name="" id="" className="filter-options">
            <option value="7">last 7 days</option>
            <option value="14">last 14 days</option>
            <option value="30">last 30 days</option>
            <option value="60">last 60 days </option>
          </select>
        </div> */}
        <table className="table ">
          <thead>
            <tr>
              <th>Service</th>
              <th>orders</th>
              <th>Cancellations</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {props.services.map((service, key) => {
              // console.log(service);
              return (
                <tr key={key}>
                  <td>
                    <div className="service-tag">
                      <img src={service.images.split(',')[0]} alt="" />
                      <p>{service.title}</p>
                    </div>
                  </td>
                  <td></td>
                  <td></td>
                  <td style={{ minWidth: '200px' }}>
                    <div className="service-options">
                      <div className="option-menu btn-group btn">
                        {active !== 'denied' && (
                          <a
                            href={
                              '/' +
                              service.username +
                              '/service/' +
                              service.url_title
                            }
                            className="btn btn-success"
                            title="view Service"
                          >
                            <i className="fa fa-eye"></i>
                          </a>
                        )}
                        {active !== 'denied' && (
                          <a
                            href={'/services/edit/' + service.url_title}
                            className="btn btn-default"
                            title="Edit Service"
                          >
                            <i className="fa fa-edit"></i>
                          </a>
                        )}

                        {active === 'paused' && (
                          <button
                            title="Activate Service"
                            data-toggle="modal"
                            data-target="#active"
                            onClick={(e) => setselectedId(service.id)}
                            className="btn btn-warning"
                          >
                            <i className="fa fa-play"></i>
                          </button>
                        )}

                        {active === 'active' && (
                          <button
                            title="Pause Service"
                            data-toggle="modal"
                            data-target="#pause"
                            onClick={(e) => setselectedId(service.id)}
                            className="btn btn-warning"
                          >
                            <i className="fa fa-pause"></i>
                          </button>
                        )}

                        <button
                          data-toggle="modal"
                          data-target="#delete"
                          title="Delete Service"
                          onClick={(e) => setselectedId(service.id)}
                          className="btn btn-danger"
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="Services">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2>Services</h2>
          </div>
          <div className="col-md-12">
            <div>
              <div className="servicesTypeButtons">
                <span
                  onClick={(e) => {
                    onServiceTagClick(e, 'active');
                  }}
                  style={active === 'active' ? { fontWeight: '600' } : {}}
                >
                  active
                  {counts.active && (
                    <span className="service-count">{counts.active}</span>
                  )}
                </span>
                <span
                  onClick={(e) => {
                    onServiceTagClick(e, 'pending');
                  }}
                  style={active === 'pending' ? { fontWeight: '600' } : {}}
                >
                  Pending Approval
                  {counts.pending && (
                    <span className="service-count">{counts.pending}</span>
                  )}
                </span>
                <span
                  onClick={(e) => {
                    onServiceTagClick(e, 'requiredModification');
                  }}
                  style={
                    active === 'requiredModification'
                      ? { fontWeight: '600' }
                      : {}
                  }
                >
                  Requires Modification{' '}
                  {counts.requiredModification && (
                    <span className="service-count">
                      {counts.requiredModification}
                    </span>
                  )}
                </span>
                <span
                  onClick={(e) => {
                    onServiceTagClick(e, 'draft');
                  }}
                  style={active === 'draft' ? { fontWeight: '600' } : {}}
                >
                  Draft{' '}
                  {counts.draft && (
                    <span className="service-count">{counts.draft}</span>
                  )}
                </span>
                <span
                  onClick={(e) => {
                    onServiceTagClick(e, 'denied');
                  }}
                  style={active === 'denied' ? { fontWeight: '600' } : {}}
                >
                  Denied{' '}
                  {counts.denied && (
                    <span className="service-count">{counts.denied}</span>
                  )}
                </span>
                <span
                  onClick={(e) => {
                    onServiceTagClick(e, 'paused');
                  }}
                  style={active === 'paused' ? { fontWeight: '600' } : {}}
                >
                  Paused{' '}
                  {counts.paused && (
                    <span className="service-count">{counts.paused}</span>
                  )}
                </span>
              </div>
              <div className="createNewButton">
                <Link to="/add-service">Create a new Service</Link>
              </div>
            </div>

            <div></div>

            {html}
          </div>
        </div>
      </div>

      <Model
        modelID="pause"
        title="Pause Service"
        content={<h4>Are your sure you want to pause this service ?</h4>}
        action={(e) => onPauseService(e, selectedId)}
      />

      <Model
        modelID="delete"
        title="Delete Service"
        content={<h4>Are your sure you want to delete this service ?</h4>}
        action={(e) => onDeleteService(e, selectedId)}
      />

      <Model
        modelID="active"
        title="Activate Service"
        content={<h4>Are your sure you want to Activate this service ?</h4>}
        action={(e) => onActivateService(e, selectedId)}
      />

      <Model
        modelID="pause"
        title="pause Service"
        content={<h4>Are your sure you want to Pause this service ?</h4>}
        action={(e) => onPauseService(e, selectedId)}
      />
    </div>
  );
};

const mapStatetoProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
  services: state.services.services,
  loadingServices: state.services.loading,
});
export default connect(mapStatetoProps, {
  loadUser,
  startLoading,
  getServices,
  setToast,
})(Services);
