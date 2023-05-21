const express = require('express');
const config = require('config');
const request = require('request');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const connection = require('../../config/dbMySQL');
var dateFormat = require('dateformat');
var day = dateFormat(new Date(), 'yyyy-mm-dd h:MM:ss');
var ORDtypes = require('../../constants');
const fs = require('fs');

//  @route  GET api/service/:title
//  @desc   get  service by title
//  @access Public

router.get('/get-user-orders/', [auth], async (req, res) => {
  try {
    const username = req.params.username;

    const sql =
      "select  * from order_details od where od.seller_username='" +
      req.user.username +
      "'";

    console.log(sql);
    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log(error.message);
      }

      if (results.length > 0) {
        return res.json({ found: true, data: [results] });
      } else {
        return res.json({ found: false, data: [] });
      }
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

router.get('/get-buyer-orders/', [auth], async (req, res) => {
  try {
    const username = req.params.username;
    const sql =
      "select  * from order_details od where od.buyer_username='" +
      req.user.username +
      "'";

    console.log(sql);
    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log(error.message);
      }

      if (results.length > 0) {
        return res.json({ found: true, data: [results] });
      } else {
        return res.json({ found: false, data: [] });
      }
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

router.get('/by-status/:status', [auth], async (req, res) => {
  try {
    const sql =
      "select od.order_id,od.order_datetime,od.status,ss.id as service_id,ss.title,concat('/',od.seller_username,'/',ss.url_title) as service_url,concat('/assets/uploads/users/',u.username,'/profileImages/',u.profile_image) as buyer_profile_photo,u.username as buyer_username,ous.delivery_time,sum(ous.amount) as amount,ous.order_status,od.seller_username from order_details od  inner join seller_services ss on ss.id=od.service_id inner join users u on u.username=od.seller_username inner join order_updation_stack ous on ous.order_id=od.order_id  where od.seller_username=? and ous.order_status=? order by ous.id desc";

    console.log(sql);
    connection.query(
      sql,
      [req.user.username, req.params.status],
      function (error, results, fields) {
        if (error) {
          console.log(error.message);
        }

        if (results.length > 0) {
          console.log(results);
          return res.json({ found: true, data: results });
        } else {
          return res.json({ found: false, data: [] });
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

router.get('/by-status/buyer/:status', [auth], async (req, res) => {
  try {
    const sql =
      "select od.order_id,od.order_datetime,od.status,ss.id as service_id,ss.title,concat('/',od.seller_username,'/',ss.url_title) as service_url,concat('/assets/uploads/users/',u.username,'/profileImages/',u.profile_image) as seller_profile_photo,u.username as buyer_username,ous.delivery_time,ous.amount,ous.order_status,od.seller_username from order_details od  inner join seller_services ss on ss.id=od.service_id inner join users u on u.username=od.buyer_username inner join order_updation_stack ous on ous.order_id=od.order_id  where od.buyer_username=? and ous.order_status=? order by ous.id desc";

    console.log(sql);
    connection.query(
      sql,
      [req.user.username, req.params.status],
      function (error, results, fields) {
        if (error) {
          console.log(error.message);
        }

        if (results.length > 0) {
          console.log(results);
          return res.json({ found: true, data: results });
        } else {
          return res.json({ found: false, data: [] });
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

router.get('/order-by-id/:orderId', [auth], async (req, res) => {
  try {
    const username = req.params.username;

    console.log('hi');
    const sql =
      "select od.order_id,od.order_datetime,od.status,od.seller_username,ss.id as service_id,ss.title,concat('/',od.seller_username,'/',ss.url_title) as service_url,concat('/assets/uploads/users/',u.username,'/profileImages/',u.profile_image) as buyer_profile_photo,u.username as buyer_username,ous.amount,ous.delivery_time,od.offer_description from order_details od  inner join seller_services ss on ss.id=od.service_id inner join users u on u.username=od.buyer_username inner join order_updation_stack ous  on ous.order_id=od.order_id  where od.seller_username=? and od.order_id=?  limit 1;" +
      ' select oc.*,u.profile_image from order_chats oc inner join users u on u.username=oc.buyer_username where oc.order_id=? order by oc.id;' +
      "select ous.delivery_time,ous.amount,ous.order_status,ous.amount from order_updation_stack ous where ous.order_id=? and (ous.order_status='extended' or ous.order_status='modified');" +
      'select sum(ous.delivery_time) as t_time,sum(ous.amount) as t_amount from order_updation_stack ous where ous.order_id=?';

    // ous.delivery_time,ous.amount,ous.order_status,od.seller_username,ous.amount,

    console.log(sql);
    connection.query(
      sql,
      [
        req.user.username,
        req.params.orderId,
        req.params.orderId,
        req.params.orderId,
        req.params.orderId,
      ],
      function (error, results, fields) {
        if (error) {
          console.log(error.message);
        }

        if (results.length > 0) {
          console.log(results[1]);

          return res.json({
            found: true,
            data: {
              orderData: results[0],
              chatData: results[1],
              orderStack: { data: results[2], total: results[3][0] },
            },
          });
        } else {
          return res.json({ found: false, data: [] });
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

router.get('/buyer/order-by-id/:orderId', [auth], async (req, res) => {
  try {
    const username = req.params.username;

    console.log('hi');
    const sql =
      "select od.order_id,od.order_datetime,od.status,ss.id as service_id,ss.title,concat('/',od.seller_username,'/',ss.url_title) as service_url,concat('/assets/uploads/users/',u.username,'/profileImages/',u.profile_image) as buyer_profile_photo,u.username as buyer_username,ous.delivery_time,ous.order_status,od.seller_username,ous.amount,od.offer_description from order_details od  inner join seller_services ss on ss.id=od.service_id inner join users u on u.username=od.buyer_username inner join order_updation_stack ous  on ous.order_id=od.order_id  where od.buyer_username=? and od.order_id=?  limit 1;" +
      ' select oc.*,u.profile_image from order_chats oc inner join users u on u.username=oc.buyer_username where oc.order_id=? order by oc.id;' +
      "select ous.delivery_time,ous.amount,ous.order_status,ous.amount from order_updation_stack ous where ous.order_id=? and (ous.order_status='extended' or ous.order_status='modified');" +
      'select sum(ous.delivery_time) as t_time,sum(ous.amount) as t_amount from order_updation_stack ous where ous.order_id=?';

    // ous.delivery_time,ous.amount,ous.order_status,od.seller_username,ous.amount,

    console.log(sql);
    connection.query(
      sql,
      [
        req.user.username,
        req.params.orderId,
        req.params.orderId,
        req.params.orderId,
        req.params.orderId,
      ],
      function (error, results, fields) {
        if (error) {
          console.log(error.message);
        }

        if (results.length > 0) {
          console.log(results[1]);

          return res.json({
            found: true,
            data: {
              orderData: results[0],
              chatData: results[1],
              orderStack: { data: results[2], total: results[3][0] },
            },
          });
        } else {
          return res.json({ found: false, data: [] });
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

router.post('/accept-order-delivery/', [auth], async (req, res) => {
  try {
    let data = { ...req.body, buyer_username: req.user.username };
    console.log(data);

    const sql =
      "update order_chats set status='accepted' where order_id=? and id=? and buyer_username=?;insert into order_updation_stack(order_id,order_status,remarks,initiated_by,update_datetime,delivery_time,amount) values (?,'completed','Order marked as Completed','buyer',now(),0,0)";

    connection.query(
      sql,
      [data.order_id, data.id, data.buyer_username, data.order_id],
      function (error, results, fields) {
        if (error) {
          console.log(error.message);
        }

        console.log(results);
        if (results.length > 0) {
          return res.json({ found: true, data: results });
        } else {
          return res.json({ found: false, data: [] });
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

router.post('/decline-order-delivery/', [auth], async (req, res) => {
  try {
    let data = { ...req.body, buyer: req.user.username };
    console.log(data);

    const sql =
      "update order_chats set status='rejected' where order_id=? and id=? and buyer_username=?";

    connection.query(
      sql,
      [data.order_id, data.id, data.buyer_username],
      function (error, results, fields) {
        if (error) {
          console.log(error.message);
        }

        if (results.length > 0) {
          console.log(results);
          return res.json({ found: true, data: results });
        } else {
          return res.json({ found: false, data: [] });
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

router.get('/get-sub-question/:q', async (req, res) => {
  try {
    const q = req.params.q;

    console.log('hi');
    const sql = 'select * from resolution_center_sub_questions where option=?';
    connection.query(sql, [q], function (error, results, fields) {
      if (error) {
        console.log(error.message);
      }

      if (results.length > 0) {
        console.log(results);
        return res.json({ found: true, data: results });
      } else {
        return res.json({ found: false, data: [] });
      }
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

router.post('/add-message/', [auth], async (req, res) => {
  try {
    const data = { ...req.body, seller_username: req.user.username };

    const sql =
      "insert into order_chats(order_id,seller_username,buyer_username,sender_username,message_type,msg_datetime,message_content) values(?,?,?,?,'plain',now(),?)";

    console.log(data);
    connection.query(
      sql,
      [
        data.order_id,
        data.seller_username,
        data.buyer_username,
        data.seller_username,
        data.message_content,
      ],
      function (error, results, fields) {
        if (error) {
          console.log(error.message);
        }

        if (results.length > 0) {
          console.log(results);
          return res.json({ found: true, data: results });
        } else {
          return res.json({ found: false, data: [] });
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

router.post('/handle-requests/', [auth], async (req, res) => {
  try {
    if (req.user.current_type === 'seller') {
      let data = { ...req.body, seller_username: req.user.username };

      if (req.body.request === ORDtypes.SEND_MODIFY_ORDER) {
        const sql1 =
          'select buyer_username from order_details where  order_id=?';

        connection.query(
          sql1,
          [data.order_id],
          function (error, results, fields) {
            if (error) {
              console.log(error.message);
            }

            data = {
              ...data,
              buyer_username: results[0].buyer_username,
              seller_username: req.user.username,
              sender_username: req.user.username,
            };
            console.log(data);
            if (results.length > 0) {
              const sql =
                "insert into order_chats(order_id,seller_username,buyer_username,sender_username,message_type,msg_datetime,title,amount,time,status,description,select_sub) values(?,?,?,?,?,now(),?,?,?,'send',?,?)";

              connection.query(
                sql,
                [
                  data.order_id,
                  data.seller_username,
                  data.buyer_username,
                  data.seller_username,
                  'modify',
                  data.title,
                  data.amount,
                  data.delivery_time,
                  data.description,
                  data.selectedSub,
                ],
                function (error, results, fields) {
                  if (error) {
                    console.log(error.message);
                  }

                  if (results.length > 0) {
                    console.log(results);
                    return res.json({ found: true, data: results });
                  } else {
                    return res.json({ found: false, data: [] });
                  }
                }
              );
            }
          }
        );
      } else if (req.body.request === ORDtypes.WITHDRAW_MODIFY_ORDER) {
        const sql =
          "update order_chats set status='withdraw' where order_id=? and id=? and seller_username=?";
        //;insert into order_updation_stack(order_id,order_status,remarks,initiated_by,update_datetime,delivery_time,amount) values (?,'completed','Order marked as Completed','buyer',now(),0,0)
        connection.query(
          sql,
          [data.order_id, data.id, data.seller_username],
          function (error, results, fields) {
            if (error) {
              console.log(error.message);
            }

            console.log(results);
            if (results.length > 0) {
              return res.json({ found: true, data: results });
            } else {
              return res.json({ found: false, data: [] });
            }
          }
        );
      } else if (req.body.request === ORDtypes.DECLINE_MODIFY_ORDER) {
        console.log('decline by seller');
        const sql =
          "update order_chats set status='rejected' where order_id=? and id=? and seller_username=?";
        //;insert into order_updation_stack(order_id,order_status,remarks,initiated_by,update_datetime,delivery_time,amount) values (?,'completed','Order marked as Completed','buyer',now(),0,0)
        connection.query(
          sql,
          [data.order_id, data.id, data.seller_username],
          function (error, results, fields) {
            if (error) {
              console.log(error.message);
            }

            console.log(results);
            if (results.length > 0) {
              return res.json({ found: true, data: results });
            } else {
              return res.json({ found: false, data: [] });
            }
          }
        );
      }

      //CANCEL ORDER

      if (req.body.request === ORDtypes.SEND_CANCEL_ORDER) {
        const sql1 =
          'select buyer_username from order_details where  order_id=?';

        connection.query(
          sql1,
          [data.order_id],
          function (error, results, fields) {
            if (error) {
              console.log(error.message);
            }

            data = {
              ...data,
              buyer_username: results[0].buyer_username,
              seller_username: req.user.username,
              sender_username: req.user.username,
            };
            console.log(data);
            if (results.length > 0) {
              const sql =
                "insert into order_chats(order_id,seller_username,buyer_username,sender_username,message_type,msg_datetime,status,description,select_sub) values(?,?,?,?,?,now(),'send',?,?)";

              connection.query(
                sql,
                [
                  data.order_id,
                  data.seller_username,
                  data.buyer_username,
                  data.seller_username,
                  'cancel',
                  data.description,
                  data.selectedSub,
                ],
                function (error, results, fields) {
                  if (error) {
                    console.log(error.message);
                  }

                  if (results.length > 0) {
                    console.log(results);
                    return res.json({ found: true, data: results });
                  } else {
                    return res.json({ found: false, data: [] });
                  }
                }
              );
            }
          }
        );
      } else if (req.body.request === ORDtypes.WITHDRAW_CANCEL_ORDER) {
        const sql =
          "update order_chats set status='withdraw' where order_id=? and id=? and seller_username=?";
        //;insert into order_updation_stack(order_id,order_status,remarks,initiated_by,update_datetime,delivery_time,amount) values (?,'completed','Order marked as Completed','buyer',now(),0,0)
        connection.query(
          sql,
          [data.order_id, data.id, data.seller_username],
          function (error, results, fields) {
            if (error) {
              console.log(error.message);
            }

            console.log(results);
            if (results.length > 0) {
              return res.json({ found: true, data: results });
            } else {
              return res.json({ found: false, data: [] });
            }
          }
        );
      } else if (req.body.request === ORDtypes.DECLINE_CANCEL_ORDER) {
        console.log('decline by seller');
        const sql =
          "update order_chats set status='rejected' where order_id=? and id=? and seller_username=?";
        //;insert into order_updation_stack(order_id,order_status,remarks,initiated_by,update_datetime,delivery_time,amount) values (?,'completed','Order marked as Completed','buyer',now(),0,0)
        connection.query(
          sql,
          [data.order_id, data.id, data.seller_username],
          function (error, results, fields) {
            if (error) {
              console.log(error.message);
            }

            console.log(results);
            if (results.length > 0) {
              return res.json({ found: true, data: results });
            } else {
              return res.json({ found: false, data: [] });
            }
          }
        );
      } else if (req.body.request === ORDtypes.ACCEPT_CANCEL_ORDER) {
        console.log('accept by seller');

        const sql =
          'select time  from order_chats  where order_id=? and id=? and seller_username=?';

        connection.query(
          sql,
          [data.order_id, data.id, data.seller_username],
          function (error, results, fields) {
            if (error) {
              console.log(error.message);
            }
            console.log('sfdsfds');
            if (results.length > 0) {
              const time = results[0].time;
              console.log('time', time);
              const sql =
                "update order_chats set status='accepted' where order_id=? and id=? and seller_username=?;insert into order_updation_stack(order_id,order_status,remarks,initiated_by,update_datetime,delivery_time,amount) values (?,'cancelled','Delivery Time Extended','buyer',now(),?,0)";

              connection.query(
                sql,
                [
                  data.order_id,
                  data.id,
                  data.seller_username,
                  data.order_id,
                  time,
                ],
                function (error, results, fields) {
                  if (error) {
                    console.log(error.message);
                  }

                  console.log(results);
                  if (results.length > 0) {
                    return res.json({ found: true, data: results });
                  } else {
                    return res.json({ found: false, data: [] });
                  }
                }
              );
            }
          }
        );
      }

      // EXTEND ORDER

      if (req.body.request === ORDtypes.SEND_EXTEND_ORDER) {
        const sql1 =
          'select buyer_username from order_details where  order_id=?';

        connection.query(
          sql1,
          [data.order_id],
          function (error, results, fields) {
            if (error) {
              console.log(error.message);
            }

            data = {
              ...data,
              buyer_username: results[0].buyer_username,
              seller_username: req.user.username,
              sender_username: req.user.username,
            };
            console.log(data);
            if (results.length > 0) {
              const sql =
                "insert into order_chats(order_id,seller_username,buyer_username,sender_username,message_type,msg_datetime,time,status,description,select_sub) values(?,?,?,?,?,now(),?,'send',?,?)";

              connection.query(
                sql,
                [
                  data.order_id,
                  data.seller_username,
                  data.buyer_username,
                  data.seller_username,
                  'extend',
                  data.delivery_time,
                  data.description,
                  data.selectedSub,
                ],
                function (error, results, fields) {
                  if (error) {
                    console.log(error.message);
                  }

                  if (results.length > 0) {
                    console.log(results);
                    return res.json({ found: true, data: results });
                  } else {
                    return res.json({ found: false, data: [] });
                  }
                }
              );
            }
          }
        );
      } else if (req.body.request === ORDtypes.WITHDRAW_EXTEND_ORDER) {
        const sql =
          "update order_chats set status='withdraw' where order_id=? and id=? and seller_username=?";
        //;insert into order_updation_stack(order_id,order_status,remarks,initiated_by,update_datetime,delivery_time,amount) values (?,'completed','Order marked as Completed','buyer',now(),0,0)
        connection.query(
          sql,
          [data.order_id, data.id, data.seller_username],
          function (error, results, fields) {
            if (error) {
              console.log(error.message);
            }

            console.log(results);
            if (results.length > 0) {
              return res.json({ found: true, data: results });
            } else {
              return res.json({ found: false, data: [] });
            }
          }
        );
      } else if (req.body.request === ORDtypes.DECLINE_EXTEND_ORDER) {
        console.log('decline by seller');
        const sql =
          "update order_chats set status='rejected' where order_id=? and id=? and seller_username=?";
        //;insert into order_updation_stack(order_id,order_status,remarks,initiated_by,update_datetime,delivery_time,amount) values (?,'completed','Order marked as Completed','buyer',now(),0,0)
        connection.query(
          sql,
          [data.order_id, data.id, data.seller_username],
          function (error, results, fields) {
            if (error) {
              console.log(error.message);
            }

            console.log(results);
            if (results.length > 0) {
              return res.json({ found: true, data: results });
            } else {
              return res.json({ found: false, data: [] });
            }
          }
        );
      } else if (req.body.request === ORDtypes.ACCEPT_EXTEND_ORDER) {
        console.log('accept by seller');

        const sql =
          'select time  from order_chats  where order_id=? and id=? and seller_username=?';

        connection.query(
          sql,
          [data.order_id, data.id, data.seller_username],
          function (error, results, fields) {
            if (error) {
              console.log(error.message);
            }
            console.log('sfdsfds');
            if (results.length > 0) {
              const time = results[0].time;
              console.log('time', time);
              const sql =
                "update order_chats set status='accepted' where order_id=? and id=? and seller_username=?;insert into order_updation_stack(order_id,order_status,remarks,initiated_by,update_datetime,delivery_time,amount) values (?,'extended','Delivery Time Extended','buyer',now(),?,0)";

              connection.query(
                sql,
                [
                  data.order_id,
                  data.id,
                  data.seller_username,
                  data.order_id,
                  time,
                ],
                function (error, results, fields) {
                  if (error) {
                    console.log(error.message);
                  }

                  console.log(results);
                  if (results.length > 0) {
                    return res.json({ found: true, data: results });
                  } else {
                    return res.json({ found: false, data: [] });
                  }
                }
              );
            }
          }
        );
      }
    } else {
      let data = { ...req.body, buyer_username: req.user.username };

      //MODIFIED
      if (req.body.request === ORDtypes.SEND_MODIFY_ORDER) {
        const sql1 =
          'select seller_username from order_details where  order_id=?';

        connection.query(
          sql1,
          [data.order_id],
          function (error, results, fields) {
            if (error) {
              console.log(error.message);
            }

            data = {
              ...data,
              buyer_username: req.user.username,
              seller_username: results[0].seller_username,
              sender_username: req.user.username,
            };
            console.log(data);
            if (results.length > 0) {
              const sql =
                "insert into order_chats(order_id,seller_username,buyer_username,sender_username,message_type,msg_datetime,title,amount,time,status,description,select_sub) values(?,?,?,?,?,now(),?,?,?,'send',?,?)";

              connection.query(
                sql,
                [
                  data.order_id,
                  data.seller_username,
                  data.buyer_username,
                  data.sender_username,
                  'modify',
                  data.title,
                  data.amount,
                  data.delivery_time,
                  data.description,
                  data.selectedSub,
                ],
                function (error, results, fields) {
                  if (error) {
                    console.log(error.message);
                  }

                  if (results.length > 0) {
                    console.log(results);
                    return res.json({ found: true, data: results });
                  } else {
                    return res.json({ found: false, data: [] });
                  }
                }
              );
            }
          }
        );
      } else if (req.body.request === ORDtypes.WITHDRAW_MODIFY_ORDER) {
        const sql =
          "update order_chats set status='withdraw' where order_id=? and id=? and buyer_username=?";
        //;insert into order_updation_stack(order_id,order_status,remarks,initiated_by,update_datetime,delivery_time,amount) values (?,'completed','Order marked as Completed','buyer',now(),0,0)
        connection.query(
          sql,
          [data.order_id, data.id, data.buyer_username],
          function (error, results, fields) {
            if (error) {
              console.log(error.message);
            }

            console.log(results);
            if (results.length > 0) {
              return res.json({ found: true, data: results });
            } else {
              return res.json({ found: false, data: [] });
            }
          }
        );
      } else if (req.body.request === ORDtypes.DECLINE_MODIFY_ORDER) {
        const sql =
          "update order_chats set status='rejected' where order_id=? and id=? and buyer_username=?";
        //;insert into order_updation_stack(order_id,order_status,remarks,initiated_by,update_datetime,delivery_time,amount) values (?,'completed','Order marked as Completed','buyer',now(),0,0)
        connection.query(
          sql,
          [data.order_id, data.id, data.buyer_username],
          function (error, results, fields) {
            if (error) {
              console.log(error.message);
            }

            console.log(results);
            if (results.length > 0) {
              return res.json({ found: true, data: results });
            } else {
              return res.json({ found: false, data: [] });
            }
          }
        );
      } else if (req.body.request === ORDtypes.ACCEPT_MODIFY_ORDER) {
        console.log('accept by BUYER');

        const sql =
          'select time,amount  from order_chats  where order_id=? and id=? and buyer_username=?';

        connection.query(
          sql,
          [data.order_id, data.id, data.buyer_username],
          function (error, results, fields) {
            if (error) {
              console.log(error.message);
            }
            console.log('sfdsfds');
            if (results.length > 0) {
              const time = results[0].time;
              const amount = results[0].amount;
              console.log('time', time);
              const sql =
                "update order_chats set status='accepted' where order_id=? and id=? and buyer_username=?;insert into order_updation_stack(order_id,order_status,remarks,initiated_by,update_datetime,delivery_time,amount) values (?,'modified','Order modified','buyer',now(),?,?)";

              connection.query(
                sql,
                [
                  data.order_id,
                  data.id,
                  data.buyer_username,
                  data.order_id,
                  time,
                  amount,
                ],
                function (error, results, fields) {
                  if (error) {
                    console.log(error.message);
                  }

                  console.log(results);
                  if (results.length > 0) {
                    return res.json({ found: true, data: results });
                  } else {
                    return res.json({ found: false, data: [] });
                  }
                }
              );
            }
          }
        );
      }

      // BUYER EXTEND
      else if (req.body.request === ORDtypes.SEND_EXTEND_ORDER) {
        const sql1 =
          'select seller_username from order_details where  order_id=?';

        connection.query(
          sql1,
          [data.order_id],
          function (error, results, fields) {
            if (error) {
              console.log(error.message);
            }

            data = {
              ...data,
              seller_username: results[0].seller_username,
            };
            console.log(data);
            if (results.length > 0) {
              const sql =
                "insert into order_chats(order_id,seller_username,buyer_username,sender_username,time,message_type,msg_datetime,status,description,select_sub) values(?,?,?,?,?,'extend',now(),'send',?,?)";

              connection.query(
                sql,
                [
                  data.order_id,
                  data.seller_username,
                  data.buyer_username,
                  data.buyer_username,
                  data.delivery_time,
                  data.description,
                  data.selectedSub,
                ],
                function (error, results, fields) {
                  if (error) {
                    console.log(error.message);
                  }

                  if (results.length > 0) {
                    console.log(results);
                    return res.json({ found: true, data: results });
                  } else {
                    return res.json({ found: false, data: [] });
                  }
                }
              );
            }
          }
        );
      } else if (req.body.request === ORDtypes.WITHDRAW_EXTEND_ORDER) {
        const sql =
          "update order_chats set status='withdraw' where order_id=? and id=? and buyer_username=?";
        //;insert into order_updation_stack(order_id,order_status,remarks,initiated_by,update_datetime,delivery_time,amount) values (?,'completed','Order marked as Completed','buyer',now(),0,0)
        connection.query(
          sql,
          [data.order_id, data.id, data.buyer_username],
          function (error, results, fields) {
            if (error) {
              console.log(error.message);
            }

            console.log(results);
            if (results.length > 0) {
              return res.json({ found: true, data: results });
            } else {
              return res.json({ found: false, data: [] });
            }
          }
        );
      } else if (req.body.request === ORDtypes.DECLINE_EXTEND_ORDER) {
        const sql =
          "update order_chats set status='rejected' where order_id=? and id=? and buyer_username=?";
        //;insert into order_updation_stack(order_id,order_status,remarks,initiated_by,update_datetime,delivery_time,amount) values (?,'completed','Order marked as Completed','buyer',now(),0,0)
        connection.query(
          sql,
          [data.order_id, data.id, data.buyer_username],
          function (error, results, fields) {
            if (error) {
              console.log(error.message);
            }

            console.log(results);
            if (results.length > 0) {
              return res.json({ found: true, data: results });
            } else {
              return res.json({ found: false, data: [] });
            }
          }
        );
      } else if (req.body.request === ORDtypes.ACCEPT_EXTEND_ORDER) {
        console.log('accept by seller');

        const sql =
          'select time  from order_chats  where order_id=? and id=? and buyer_username=?';

        connection.query(
          sql,
          [data.order_id, data.id, data.buyer_username],
          function (error, results, fields) {
            if (error) {
              console.log(error.message);
            }
            console.log('sfdsfds');
            if (results.length > 0) {
              const time = results[0].time;
              console.log('time', time);
              const sql =
                "update order_chats set status='accepted' where order_id=? and id=? and buyer_username=?;insert into order_updation_stack(order_id,order_status,remarks,initiated_by,update_datetime,delivery_time,amount) values (?,'extended','Delivery Time Extended','buyer',now(),?,0)";

              connection.query(
                sql,
                [
                  data.order_id,
                  data.id,
                  data.buyer_username,
                  data.order_id,
                  time,
                ],
                function (error, results, fields) {
                  if (error) {
                    console.log(error.message);
                  }

                  console.log(results);
                  if (results.length > 0) {
                    return res.json({ found: true, data: results });
                  } else {
                    return res.json({ found: false, data: [] });
                  }
                }
              );
            }
          }
        );
      }

      //CANCELLED

      if (req.body.request === ORDtypes.SEND_CANCEL_ORDER) {
        const sql1 =
          'select seller_username from order_details where  order_id=?';

        connection.query(
          sql1,
          [data.order_id],
          function (error, results, fields) {
            if (error) {
              console.log(error.message);
            }

            data = {
              ...data,
              seller_username: results[0].seller_username,
              sender_username: req.user.username,
            };
            console.log(data);
            if (results.length > 0) {
              const sql =
                "insert into order_chats(order_id,seller_username,buyer_username,sender_username,message_type,msg_datetime,status,description,select_sub) values(?,?,?,?,?,now(),'send',?,?)";

              connection.query(
                sql,
                [
                  data.order_id,
                  data.seller_username,
                  data.buyer_username,
                  data.sender_username,
                  'cancel',
                  data.description,
                  data.selectedSub,
                ],
                function (error, results, fields) {
                  if (error) {
                    console.log(error.message);
                  }

                  if (results.length > 0) {
                    console.log(results);
                    return res.json({ found: true, data: results });
                  } else {
                    return res.json({ found: false, data: [] });
                  }
                }
              );
            }
          }
        );
      } else if (req.body.request === ORDtypes.WITHDRAW_CANCEL_ORDER) {
        const sql =
          "update order_chats set status='withdraw' where order_id=? and id=? and buyer_username=?";
        //;insert into order_updation_stack(order_id,order_status,remarks,initiated_by,update_datetime,delivery_time,amount) values (?,'completed','Order marked as Completed','buyer',now(),0,0)
        connection.query(
          sql,
          [data.order_id, data.id, data.buyer_username],
          function (error, results, fields) {
            if (error) {
              console.log(error.message);
            }

            console.log(results);
            if (results.length > 0) {
              return res.json({ found: true, data: results });
            } else {
              return res.json({ found: false, data: [] });
            }
          }
        );
      } else if (req.body.request === ORDtypes.DECLINE_CANCEL_ORDER) {
        const sql =
          "update order_chats set status='rejected' where order_id=? and id=? and buyer_username=?";
        //;insert into order_updation_stack(order_id,order_status,remarks,initiated_by,update_datetime,delivery_time,amount) values (?,'completed','Order marked as Completed','buyer',now(),0,0)
        connection.query(
          sql,
          [data.order_id, data.id, data.buyer_username],
          function (error, results, fields) {
            if (error) {
              console.log(error.message);
            }

            console.log(results);
            if (results.length > 0) {
              return res.json({ found: true, data: results });
            } else {
              return res.json({ found: false, data: [] });
            }
          }
        );
      } else if (req.body.request === ORDtypes.ACCEPT_CANCEL_ORDER) {
        console.log('accept by seller');

        const sql =
          'select time  from order_chats  where order_id=? and id=? and buyer_username=?';

        connection.query(
          sql,
          [data.order_id, data.id, data.buyer_username],
          function (error, results, fields) {
            if (error) {
              console.log(error.message);
            }
            console.log('sfdsfds');
            if (results.length > 0) {
              const time = results[0].time;
              console.log('time', time);
              const sql =
                "update order_chats set status='accepted' where order_id=? and id=? and buyer_username=?;insert into order_updation_stack(order_id,order_status,remarks,initiated_by,update_datetime,delivery_time,amount) values (?,'cancelled','Delivery Time Extended','buyer',now(),?,0)";

              connection.query(
                sql,
                [
                  data.order_id,
                  data.id,
                  data.buyer_username,
                  data.order_id,
                  time,
                ],
                function (error, results, fields) {
                  if (error) {
                    console.log(error.message);
                  }

                  console.log(results);
                  if (results.length > 0) {
                    return res.json({ found: true, data: results });
                  } else {
                    return res.json({ found: false, data: [] });
                  }
                }
              );
            }
          }
        );
      }
    }

    try {
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('server error');
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

router.post('/send-modify-order/', [auth], async (req, res) => {
  try {
    let data = { ...req.body, seller_username: req.user.username };
    console.log(data);

    const sql1 = 'select buyer_username from order_details where  order_id=?';

    connection.query(sql1, [data.order_id], function (error, results, fields) {
      if (error) {
        console.log(error.message);
      }

      data = {
        ...data,
        buyer_username: results[0].buyer_username,
        seller_username: req.user.username,
        sender_username: req.user.username,
      };
      console.log(data);
      if (results.length > 0) {
        const sql =
          "insert into order_chats(order_id,seller_username,buyer_username,sender_username,message_type,msg_datetime,title,amount,time,status,description,select_sub) values(?,?,?,?,?,now(),?,?,?,'send',?,?)";

        connection.query(
          sql,
          [
            data.order_id,
            data.seller_username,
            data.buyer_username,
            data.seller_username,
            'modify',
            data.title,
            data.amount,
            data.delivery_time,
            data.description,
            data.selectedSub,
          ],
          function (error, results, fields) {
            if (error) {
              console.log(error.message);
            }

            if (results.length > 0) {
              console.log(results);
              return res.json({ found: true, data: results });
            } else {
              return res.json({ found: false, data: [] });
            }
          }
        );
      }
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

router.post('/send-modify-order/', [auth], async (req, res) => {
  try {
    let data = { ...req.body, seller_username: req.user.username };
    console.log(data);

    const sql1 =
      'select buyer_username from order_details where  order_id=? and seller_username=?';

    connection.query(
      sql1,
      [data.order_id, req.user.username],
      function (error, results, fields) {
        if (error) {
          console.log(error.message);
        }

        data = {
          ...data,
          buyer_username: results[0].buyer_username,
          seller_username: req.user.username,
          sender_username: req.user.username,
        };
        console.log(data);
        if (results.length > 0) {
          const sql =
            "insert into order_chats(order_id,seller_username,buyer_username,sender_username,message_type,msg_datetime,title,amount,time,status,description,select_sub) values(?,?,?,?,?,now(),?,?,?,'send',?,?)";

          connection.query(
            sql,
            [
              data.order_id,
              data.seller_username,
              data.buyer_username,
              data.seller_username,
              'modify',
              data.title,
              data.amount,
              data.delivery_time,
              data.description,
              data.selectedSub,
            ],
            function (error, results, fields) {
              if (error) {
                console.log(error.message);
              }

              if (results.length > 0) {
                console.log(results);
                return res.json({ found: true, data: results });
              } else {
                return res.json({ found: false, data: [] });
              }
            }
          );
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

router.post('/send-order-delivery/', [auth], async (req, res) => {
  try {
    let data = { ...req.body, seller_username: req.user.username };
    console.log(data);

    const sql1 =
      "select buyer_username from order_details where  order_id=? and seller_username=?;insert into order_updation_stack(order_id,order_status,remarks,initiated_by,update_datetime,delivery_time,amount) values (?,'delivered','Seller deliver Work','buyer',now(),0,0)";

    connection.query(
      sql1,
      [data.order_id, req.user.username, data.order_id],
      function (error, results, fields) {
        if (error) {
          console.log(error.message);
        }

        data = {
          ...data,
          buyer_username: results[0][0].buyer_username,
          seller_username: req.user.username,
          sender_username: req.user.username,
        };

        if (results.length > 0) {
          const sql =
            "insert into order_chats(order_id,seller_username,buyer_username,sender_username,message_type,msg_datetime,status,description,attachments) values(?,?,?,?,'deliver',now(),'send',?,?)";

          connection.query(
            sql,
            [
              data.order_id,
              data.seller_username,
              data.buyer_username,
              data.seller_username,
              data.description,
              data.attachments,
            ],
            function (error, results, fields) {
              if (error) {
                console.log(error.message);
              }

              if (results?.length > 0) {
                return res.json({ found: true, data: results });
              } else {
                return res.json({ found: false, data: [] });
              }
            }
          );
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

router.post('/send-extend-order/', [auth], async (req, res) => {
  try {
    let data = { ...req.body, seller_username: req.user.username };
    console.log(data);

    const sql1 = 'select buyer_username from order_details where  order_id=?';

    connection.query(sql1, [data.order_id], function (error, results, fields) {
      if (error) {
        console.log(error.message);
      }

      data = {
        ...data,
        buyer_username: results[0].buyer_username,
      };
      console.log(data);
      if (results.length > 0) {
        const sql =
          "insert into order_chats(order_id,seller_username,buyer_username,sender_username,time,message_type,msg_datetime,status,description,select_sub) values(?,?,?,?,?,'extend',now(),'send',?,?)";

        connection.query(
          sql,
          [
            data.order_id,
            data.seller_username,
            data.buyer_username,
            data.seller_username,
            data.delivery_time,
            data.description,
            data.selectedSub,
          ],
          function (error, results, fields) {
            if (error) {
              console.log(error.message);
            }

            if (results.length > 0) {
              console.log(results);
              return res.json({ found: true, data: results });
            } else {
              return res.json({ found: false, data: [] });
            }
          }
        );
      }
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

router.post('/send-cancel-order/', [auth], async (req, res) => {
  try {
    let data = { ...req.body, seller_username: req.user.username };
    console.log(data);

    const sql1 = 'select buyer_username from order_details where  order_id=?';

    connection.query(sql1, [data.order_id], function (error, results, fields) {
      if (error) {
        console.log(error.message);
      }

      data = {
        ...data,
        buyer_username: results[0].buyer_username,
      };
      console.log(data);
      if (results.length > 0) {
        const sql =
          "insert into order_chats(order_id,seller_username,buyer_username,sender_username,message_type,msg_datetime,status,description,select_sub) values(?,?,?,?,'cancel',now(),'send',?,?)";

        connection.query(
          sql,
          [
            data.order_id,
            data.seller_username,
            data.buyer_username,
            data.seller_username,
            data.delivery_time,
            data.description,
            data.selectedSub,
          ],
          function (error, results, fields) {
            if (error) {
              console.log(error.message);
            }

            if (results.length > 0) {
              console.log(results);
              return res.json({ found: true, data: results });
            } else {
              return res.json({ found: false, data: [] });
            }
          }
        );
      }
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

module.exports = router;
