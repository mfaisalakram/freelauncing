import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ServiceManagement = () => {
  const [servicesData, setservicesData] = useState([]);
  useEffect(() => {
    axios
      .get('http://localhost:4500/api/services/service-management')
      .then((res) => {
        console.log(res.data);
        setservicesData(res.data);
      });
  }, []);

  // function to get the status_type of user from database
  // If active then banned and vice versa on button click
  let ChangeHandler = (id, type) => {
    axios
      .put('http://localhost:4500/api/services/service-management', {
        id: id,
        type: type,
      })
      .then((res) => {
        let services = servicesData.filter(function (services) {
          if (services.id === id) {
            services.status = type;
          }

          return services;
        });
        setservicesData(services);
      });
  };

  // function to search status by dropdown with the help of status_type
  const SearchStatusHandler = (type) => {
    axios
      .post('http://localhost:4500/api/services/service-status', { type: type })
      .then((res) => {
        setservicesData(res.data);
      });
  };

  // function to search name by search bar with the help of id
  const SearchNameHandler = (id) => {
    axios
      .post('http://localhost:4500/api/services/search-name', { id: id })
      .then((res) => {
        setservicesData(res.data);
      });
  };

  return (
    <div className="row">
      <div className="col-lg 12">
        <div className="row">
          <div className="col-md-2">
            <span>
              <label>
                <strong>Search By Id:</strong>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Type to search..."
                onChange={(e) => SearchNameHandler(e.target.value)}
              />
            </span>
          </div>

          <div className="col-md-2">
            <span>
              <label>
                <strong>Search by Type:</strong>
              </label>
              <select
                className="form-control"
                onChange={(e) => SearchStatusHandler(e.target.value)}
              >
                <option value="">Select Type...</option>
                <option value="active">Active</option>
                <option value="denied">Denied</option>
                <option value="pending">pending</option>
                <option value="deleted">deleted</option>
                <option value="requiredModification">
                  requiredModification
                </option>
                <option value="paused">paused</option>
                <option value="draft">draft</option>
              </select>
            </span>
          </div>
        </div>
        <br />
        <br />
        <h5>
          <strong>User Services:</strong>
        </h5>
        <div className="mb-5">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>id</th>
                <th>title</th>
                <th>price</th>
                <th>status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {servicesData &&
                servicesData.map((services) => {
                  return (
                    <tr>
                      <td>{services['id']}</td>
                      <td>{services['title']}</td>
                      <td> {services['price']}</td>
                      <td> {services['status']}</td>
                      <td>
                        {services.status === 'active' ? (
                          <button
                            className="btn btn-danger"
                            onClick={() => ChangeHandler(services.id, 'denied')}
                          >
                            Banned Now
                          </button>
                        ) : (
                          <button
                            className="btn btn-success"
                            onClick={() => ChangeHandler(services.id, 'active')}
                          >
                            Activate Now
                          </button>
                        )}

                        {services.status === 'pending' ? (
                          <span>
                            <button
                              className="btn btn-success"
                              onClick={() =>
                                ChangeHandler(
                                  services.id,
                                  'requiredModification'
                                )
                              }
                            >
                              Request for Modification
                            </button>

                            <a className="btn btn-success">view service</a>
                          </span>
                        ) : (
                          ''
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default ServiceManagement;
