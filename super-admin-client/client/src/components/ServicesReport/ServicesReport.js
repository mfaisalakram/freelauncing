import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ServicesReport = () => {
  const [servicereport, setservicereport] = useState([]);
  useEffect(() => {
    axios
      .get('http://localhost:4500/api/services/services-report')
      .then((res) => {
        console.log(res.data);
        setservicereport(res.data);
      });
  }, []);

  // let ChangeHandler = (id, type) => {
  //   axios
  //     .put('http://localhost:4500/api/services/service-report', {
  //       id: id,
  //       type: type,
  //     })
  //     .then((res) => {
  //       let services_report = servicereport.filter(function (services_report) {
  //         if (services_report.id === id) {
  //           services_report.status = type;
  //         }

  //         return services_report;
  //       });
  //       setservicereport(services_report);
  //     });
  // };

  return (
    <div className="row">
      <div className="col-lg 12">
        <h5>
          <strong>Services Report:</strong>
        </h5>
        <div className="mb-5">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>id</th>
                <th>service_title</th>
                <th>report_id</th>
                <th>description</th>
                <th>report_by</th>
                <th>Status</th>
                <th>Option</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {servicereport &&
                servicereport.map((services_report) => {
                  return (
                    <tr>
                      {console.log(services_report)}
                      <td>{services_report['id']}</td>
                      <td>{services_report['title']}</td>
                      <td> {services_report['report_id']}</td>
                      <td> {services_report['description']}</td>
                      <td> {services_report['report_by']}</td>
                      <td> {services_report['current_status']}</td>
                      <td>
                        <a
                          className="btn btn-success"
                          href="http://localhost:3000/aftabfalak/i-will-design-website"
                        >
                          View service
                        </a>
                      </td>

                      {/* <td>
                                   
                                 {services_report.status === "active" ? 
                                <button onClick={() => ChangeHandler(services_report.id, "banned")} className="btn btn-danger"> 
                                Banned Now </button>
                                 :  <button onClick={() => ChangeHandler(services_report.id, "active")} className="btn btn-danger"> 
                                Active Now </button>
                                }
                                </td> */}
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

export default ServicesReport;
