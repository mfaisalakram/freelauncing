import axios from 'axios';
import React, { useEffect, useState } from 'react';

const AllUsers = () => {
  const [usersData, setusersData] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:4500/api/users/all-users').then((res) => {
      setusersData(res.data);
    });
  }, []);

  let ChangeHandler = (id, type) => {
    axios
      .put('http://localhost:4500/api/users/all-users', { id: id, type: type })
      .then((res) => {
        let users = usersData.filter(function (user) {
          if (user.id === id) {
            user.account_status = type;
          }

          return user;
        });
        setusersData(users);
      });
  };

  const ShowTypeHandler = (type) => {
    axios
      .post('http://localhost:4500/api/users/get-user-type', { type: type })
      .then((res) => {
        setusersData(res.data);
      });
  };

  const ShowNameHandler = (fname) => {
    axios
      .post('http://localhost:4500/api/users//get-user-byname', {
        fname: fname,
      })
      .then((res) => {
        setusersData(res.data);
      });
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="row">
          <div className="col-md-2">
            <span>
              <label>
                <strong>Search By Name:</strong>
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Type to search..."
                onChange={(e) => ShowNameHandler(e.target.value)}
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
                onChange={(e) => ShowTypeHandler(e.target.value)}
              >
                <option>Select Type...</option>
                <option value="active">Active</option>
                <option value="banned">Banned</option>
              </select>
            </span>
          </div>
        </div>
        <div></div>
        <br />
        <br />

        <h5 className="mb-4">
          <strong>Users</strong>
        </h5>
        <div className="mb-5">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Id</th>
                <th>Full Name</th>

                <th>E-mail</th>
                <th>Account_Type</th>
                <th>status</th>
                <th>Actions</th>
                {/* <th style={{ width: "200px" }}>Username</th> */}
              </tr>
            </thead>
            <tbody>
              {usersData &&
                usersData.map((user) => {
                  return (
                    <tr>
                      {/* <th scope="row">1</th> */}
                      <td>{user['id']}</td>
                      <td>
                        {user['fname']} {user['lname']}{' '}
                      </td>

                      <td> {user['email']}</td>
                      <td> {user['account_type']}</td>
                      <td> {user['account_status']}</td>
                      <td>
                        {user.account_status === 'active' ? (
                          <button
                            onClick={() => ChangeHandler(user.id, 'banned')}
                            className="btn btn-danger"
                          >
                            {' '}
                            Banned Now{' '}
                          </button>
                        ) : (
                          <button
                            onClick={() => ChangeHandler(user.id, 'active')}
                            className="btn btn-success"
                          >
                            Active now
                          </button>
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

export default AllUsers;
