import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentMethod = () => {
  const [paymentData, setpaymentData] = useState([]);
  useEffect(() => {
    axios
      .get('http://localhost:4500/api/payment/payment-method')
      .then((res) => {
        console.log(res.data);
        setpaymentData(res.data);
      });
  }, []);
  return (
    <div className="row">
      <div className="col-g-12">
        <h5>Payment Records:</h5>
        <div className="mb-5">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>payment_id</th>
                <th>name</th>
                <th>amount_from_card</th>
                <th>order_id</th>
                <th>user_id</th>
                <th>payment_type</th>
                <th>country</th>
              </tr>
            </thead>
            <tbody>
              {paymentData &&
                paymentData.map((payment) => {
                  return (
                    <tr>
                      <td>{payment['payment_id']}</td>
                      <td>{payment['name']}</td>
                      <td> {payment['amount_from_card']}</td>
                      <td> {payment['order_id']}</td>
                      <td> {payment['user_id']}</td>
                      <td> {payment['payment_type']}</td>
                      <td> {payment['country']}</td>
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

export default PaymentMethod;
