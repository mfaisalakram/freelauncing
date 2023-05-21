const express = require('express');
const config = require('config');
const request = require('request');
const router = express.Router();
const auth = require('../../middleware/auth');
const Chat = require('../../models/Chat');
const { check, validationResult } = require('express-validator');
const connection = require('../../config/dbMySQL');
const PaymentSession = require('../../models/PaymentSessions');
var dateFormat = require('dateformat');

var day = dateFormat(new Date(), 'yyyy-mm-dd h:MM:ss');
const fs = require('fs-extra');

//  @route  GET api/service/search/:keywords
//  @desc   skills data in profile
//  @access pubic

router.get('/search/', [], async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(error.array());
    return res.json({ error: error.array() });
  }

  let where = " ss.status='active' ";
  let where1 = "where ss.status='active' ";
  let langWhere =
    'and u.id IN (SELECT DISTINCT selang.`user_id` FROM seller_languages selang  INNER JOIN languages lang ON lang.`id` = selang.`lang_id`) ';

  let ServicesWhere = "where ss.status='active' ";
  let CategoryWhere = "where ss.status='active' ";
  let SellerLevelWhere = " ss.status='active' ";
  let CountryWhere = "where ss.status='active' ";
  let Where = "where ss.status='active' ";

  if (req.query.category) {
    ServicesWhere += " and ss.cat_id='" + req.query.category + "' ";
    CategoryWhere += " and ss.cat_id='" + req.query.category + "' ";
    SellerLevelWhere += " and ss.cat_id='" + req.query.category + "' ";
    CountryWhere += " and ss.cat_id='" + req.query.category + "' ";
  }

  //==============DElivery time============
  if (req.query.delivery_time) {
    ServicesWhere +=
      " and ss.delivery_time<='" + req.query.delivery_time + "' ";
    CategoryWhere +=
      " and ss.delivery_time<='" + req.query.delivery_time + "' ";
    SellerLevelWhere +=
      " and ss.delivery_time<='" + req.query.delivery_time + "' ";
    CountryWhere += " and ss.delivery_time<='" + req.query.delivery_time + "' ";

    // where += " and ss.delivery_time<='" + req.query.delivery_time + "' ";
    // where1 += " and ss.delivery_time<='" + req.query.delivery_time + "' ";
  }

  //==============Seller Level ============
  if (req.query.seller_type) {
    let formatQuery = [];
    req.query.seller_type.split('-').map((k) => {
      formatQuery.push(" LOWER(slv.level_name)='" + k.toLowerCase() + "' ");
    });

    ServicesWhere += ' and (' + formatQuery.join(' or ') + ' )';
    CategoryWhere += ' and (' + formatQuery.join(' or ') + ' )';
    SellerLevelWhere += ' and (' + formatQuery.join(' or ') + ' )';
    CountryWhere += ' and (' + formatQuery.join(' or ') + ' )';
  }

  if (req.query.seller_country) {
    ServicesWhere += " and ctry.name='" + req.query.seller_country + "' ";
    CategoryWhere += " and ctry.name='" + req.query.seller_country + "' ";
    SellerLevelWhere += " and ctry.name='" + req.query.seller_country + "' ";
    CountryWhere += " and ctry.name='" + req.query.seller_country + "' ";
  }

  if (req.query.price_max && req.query.price_min) {
    // where +=
    //   " and (ss.price<='" +
    //   req.query.price_max +
    //   "' and ss.price>='" +
    //   req.query.price_min +
    //   "') ";

    ServicesWhere +=
      " and (ss.price<='" +
      req.query.price_max +
      "' and ss.price>='" +
      req.query.price_min +
      "') ";
    CategoryWhere +=
      " and (ss.price<='" +
      req.query.price_max +
      "' and ss.price>='" +
      req.query.price_min +
      "') ";
    SellerLevelWhere +=
      " and (ss.price<='" +
      req.query.price_max +
      "' and ss.price>='" +
      req.query.price_min +
      "') ";
    CountryWhere +=
      " and (ss.price<='" +
      req.query.price_max +
      "' and ss.price>='" +
      req.query.price_min +
      "') ";
  } else if (req.query.price_max) {
    // where += " and ss.price<='" + req.query.price_max + "' ";
    // where1 += " and ss.price<='" + req.query.price_max + "' ";

    ServicesWhere += " and ss.price<='" + req.query.price_max + "' ";
    CategoryWhere += " and ss.price<='" + req.query.price_max + "' ";
    SellerLevelWhere += " and ss.price<='" + req.query.price_max + "' ";
    CountryWhere += " and ss.price<='" + req.query.price_max + "' ";
  } else if (req.query.price_min) {
    // where += " and ss.price>='" + req.query.price_min + "' ";
    // where1 += " and ss.price>='" + req.query.price_min + "' ";

    ServicesWhere += " and ss.price>='" + req.query.price_min + "' ";
    CategoryWhere += " and ss.price>='" + req.query.price_min + "' ";
    SellerLevelWhere += " and ss.price>='" + req.query.price_min + "' ";
    CountryWhere += " and ss.price>='" + req.query.price_min + "' ";
  }

  if (req.query.keyword) {
    // where += " and ss.title like '%" + req.query.keyword + "%' ";
    // where1 += " and ss.title like '%" + req.query.keyword + "%' ";

    ServicesWhere += " and ss.title like '%" + req.query.keyword + "%' ";
    CategoryWhere += " and ss.title like '%" + req.query.keyword + "%' ";
    SellerLevelWhere += " and ss.title like '%" + req.query.keyword + "%' ";
    CountryWhere += " and ss.title like '%" + req.query.keyword + "%' ";
  }

  if (req.query.seller_languages) {
    let formatQuery = [];

    req.query.seller_languages.split('-').map((k) => {
      formatQuery.push("lang.name='" + k + "'");
    });

    where1 +=
      'and  ss.id IN (SELECT DISTINCT ss.id FROM seller_services ss INNER JOIN business_categories bc ON bc.`cat_id` = ss.`cat_id` INNER JOIN users u ON ss.user_id = u.id INNER JOIN countries ctry ON ctry.`id`=u.`country` INNER JOIN seller_languages selang ON selang.`user_id`=u.id INNER JOIN languages lang ON lang.`id`=selang.`lang_id` WHERE ' +
      formatQuery.join(' and ') +
      ' ';
    where1 += ' and ' + where + ' ) ';

    where += ' and ' + formatQuery.join(' and ') + ' ';
  }

  let where2 = '';
  console.log(res.body);
  try {
    const sql =
      "select ss.id,ss.title,ss.price,ss.url_title,u.username,concat('/assets/uploads/users/',u.username,'/profileImages/',u.profile_image) as profile_image,group_concat('/assets/uploads/users/',u.username,'/serviceImages/',si.image_path SEPARATOR '@')  as images  from seller_services ss INNER JOIN business_categories bc ON bc.`cat_id`=ss.`cat_id` INNER JOIN users u ON ss.user_id = u.id  inner join services_images si on si.service_id=ss.id " +
      ServicesWhere +
      ' group by ss.id;' +
      'select ss.`cat_id`, COUNT(ss.`cat_id`) AS COUNT,bc.`cat_name` from seller_services ss INNER JOIN business_categories bc ON bc.`cat_id`=ss.`cat_id` INNER JOIN users u ON ss.user_id = u.id   INNER JOIN countries ctry ON ctry.`id`=u.`country` INNER JOIN seller_levels slv ON  slv.`id`=u.`seller_level_id`   ' +
      CategoryWhere +
      ' ' +
      langWhere +
      ' group by ss.cat_id;' +
      'SELECT sll.id AS idd,(SELECT COUNT(u.id) FROM seller_levels sl INNER JOIN users u ON sl.`id` = u.`seller_level_id` INNER JOIN seller_services ss ON ss.user_id = u.id   INNER JOIN countries ctry ON ctry.`id`=u.`country` INNER JOIN seller_levels slv ON  slv.`id`=u.`seller_level_id`  WHERE idd = u.`seller_level_id` and ' +
      SellerLevelWhere +
      ' ' +
      langWhere +
      ') AS counts FROM seller_levels AS sll ;' +
      'SELECT DISTINCT l.`id`,l.`name`,COUNT(sl.`lang_id`) AS counts FROM seller_languages sl INNER JOIN languages l ON sl.`lang_id` = l.id INNER JOIN seller_services ss ON sl.user_id = ss.`user_id` INNER JOIN users u ON u.id = ss.`user_id`  INNER JOIN countries ctry ON ctry.`id`=u.`country` INNER JOIN seller_levels slv ON  slv.`id`=u.`seller_level_id`  ' +
      where1 +
      ' GROUP BY sl.`lang_id`;' +
      'SELECT ctry.id,ctry.`name`,COUNT(ctry.id)As counts FROM seller_services ss INNER JOIN users u ON u.id = ss.`user_id`INNER JOIN countries ctry ON ctry.`id`=u.`country` INNER JOIN seller_levels slv ON  slv.`id`=u.`seller_level_id` INNER JOIN seller_languages selang ON selang.`user_id`=u.id INNER JOIN languages lang ON lang.`id`=selang.`lang_id` ' +
      CountryWhere +
      ' GROUP BY ctry.id';

    connection.query(sql, async function (error, results, fields) {
      console.log(sql);
      if (error) {
        console.log(error.message);
      }

      if (results?.length > 0) {
        console.log('(((((((((((((((((((((()))))))))))))))))))))', results);
        const result2 = {
          services: [...results[0]],
          categories: [...results[1]],
          sellerlevels: [...results[2]],
          sellerlanguages: [...results[3]],
          sellerCountries: [...results[4]],
          // sellerlanguages: [],
          // sellerCountries: [],
        };

        return res.json({
          done: true,
          data: result2,
        });
      } else {
        return res.json({
          done: false,
          data: [],
        });
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error', err.message);
  }
});

//  @route  Post api/service
//  @desc   Create a post
//  @access Private

router.post(
  '/',
  [
    check('title', 'title is required').not().isEmpty(),
    check('category', 'category is required').not().isEmpty(),
    check('subcategory', 'subcategory is required').not().isEmpty(),
    check('serviceType', 'service Type is required').not().isEmpty(),
    check('price', 'Price is required').not().isEmpty(),
    check('Delivery', 'Delivery is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('images', 'Images is required').not().isEmpty(),
    [auth],
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      console.log(error.array());
      return res.json({ error: error.array() });
    }

    try {
      const {
        title,
        category,
        subcategory,
        serviceType,
        searchTags,
        price,
        Delivery,
        description,
        images,
      } = req.body;

      // req.file=images[0];
      //  const id= req.session.user.id=!undefined?req.session.user.id:1;
      const id = 11;

      const urlTitle = title.split(' ').join('-').split(',').join('');

      connection.query(
        "select id from seller_services where url_title='" +
          urlTitle +
          "' and user_id='" +
          req.user.id +
          "'",
        function (error, results, fields) {
          if (error) console.log(error);
          if (results.length === 0) {
            const sql =
              "insert into seller_services(title,url_title,user_id,cat_id,subcat_id,search_tags,service_type,price,delivery_time,description,status,created_date) values('" +
              title +
              "','" +
              urlTitle +
              "','" +
              req.user.id +
              "','" +
              category +
              "','" +
              subcategory +
              "','" +
              searchTags +
              "','" +
              serviceType +
              "','" +
              price +
              "','" +
              Delivery +
              "','" +
              description +
              "','" +
              'active' +
              "',now())";

            connection.query(sql, function (error, results, fields) {
              if (error) {
                console.log(error.message);
              }

              if (results.affectedRows === 1) {
                const insertid = results.insertId;

                let imgs = [];
                let values = req.body.images.map((image, index) => {
                  let base64Image = image.split(';base64,').pop();

                  let imagesName =
                    dateFormat(new Date(), 'yyyy-mm-dd h-MM-ss') +
                    '-' +
                    index +
                    req.body.title +
                    '.png';

                  imgs.push(
                    "('" + imagesName + "'," + index + ',' + insertid + ')'
                  );

                  //55555555

                  // let profileImage = "imagePlaceholder.jpg";

                  // // ${__dirname}/client/public/assets/uploads/attachments/messages
                  // let path = `./client/public/assets/uploads/users/` + username;

                  // fs.access(path, function(err) {
                  //   if (err && err.code === "ENOENT") {
                  //     fs.mkdir(path);

                  //     path += `/profileImages`;

                  //     fs.access(path, function(err) {
                  //       if (err && err.code === "ENOENT") {
                  //         fs.mkdir(path);

                  //         fs.copyFile(
                  //           `./client/public/assets/uploads/imagePlaceholder.jpg`,
                  //           path + "/imagePlaceholder.jpg",
                  //           err => {}
                  //         );
                  //       } else {
                  //       }
                  //     });
                  //   } else {
                  //   }
                  // });
                  //ffffffffff

                  let path =
                    './client/public/assets/uploads/users/' + req.user.username;
                  path += '/serviceImages';
                  fs.access(path, function (err) {
                    if (err && err.code === 'ENOENT') {
                      fs.mkdir(path);
                    } else {
                    }
                  });

                  path =
                    '../../../client/public/assets/uploads/users/' +
                    req.user.username +
                    '/serviceImages/';

                  fs.writeFile(
                    __dirname + path + imagesName,
                    base64Image,
                    { encoding: 'base64' },
                    function (err) {
                      if (err) console.log(err);
                      console.log('File created');
                    }
                  );
                });

                const sql1 =
                  'INSERT INTO services_images (image_path,image_position,service_id) values ' +
                  imgs.join(',');
                console.log(sql1);
                connection.query(sql1, function (error, results, fields) {
                  if (error) console.log(error);
                  if (results.affectedRows != 0) {
                    return res.json({ done: true });
                  } else {
                    return res.json({
                      done: false,
                      msg: 'Server error! please contact to support for help',
                    });
                  }
                });
              } else {
                return res.json({
                  done: false,
                  msg: 'Server error! please contact to support for help',
                });
              }
            });
          } else {
            return res.json({
              done: false,
              msg: 'We analyse that you have already providing same type of service.Please provide different type of services',
            });
          }
        }
      );
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('server error', err.message);
    }
  }
);

//  @route  Post api/service
//  @desc   Create a service
//  @access Private

router.post(
  '/edit',

  [
    check('title', 'title is required').not().isEmpty(),
    check('urlTitle', 'service url is required').not().isEmpty(),
    check('category', 'category is required').not().isEmpty(),
    check('subcategory', 'subcategory is required').not().isEmpty(),
    check('serviceType', 'service Type is required').not().isEmpty(),
    check('price', 'Price is required').not().isEmpty(),
    check('Delivery', 'Delivery is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('images', 'Images is required').not().isEmpty(),
    [auth],
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      console.log(error.array());
      return res.json({ error: error.array() });
    }

    try {
      const {
        title,
        category,
        subcategory,
        serviceType,
        searchTags,
        price,
        Delivery,
        description,
        images,
        urlTitle,
        serviceID,
      } = req.body;

      connection.query(
        "select id,status from seller_services where url_title='" +
          urlTitle +
          "' and user_id='" +
          req.user.id +
          "'",
        function (error, results, fields) {
          if (error) console.log(error);
          if (results.length > 0) {
            const status = results[0]['status'];
            if (
              status === 'active' ||
              status === 'paused' ||
              status === 'draft'
            ) {
              const sql =
                "update seller_services set title='" +
                title +
                "',cat_id='" +
                category +
                "',subcat_id='" +
                subcategory +
                "',subcat_id='" +
                subcategory +
                "',search_tags='" +
                searchTags +
                "',service_type='" +
                serviceType +
                "',price='" +
                price +
                "',delivery_time='" +
                Delivery +
                "',description='" +
                description +
                "',status='" +
                status +
                "',created_date=now() where user_id='" +
                req.user.id +
                "' and url_title='" +
                urlTitle +
                "'";

              connection.query(sql, function (error, results, fields) {
                if (error) {
                  console.log(error.message);
                }

                console.log(results);

                if (results.affectedRows > 0) {
                  let imgs = [];
                  let values = req.body.images.map((image, index) => {
                    let base64Image = image.split(';base64,').pop();

                    let imagesName =
                      dateFormat(new Date(), 'yyyy-mm-dd h-MM-ss') +
                      '-' +
                      index +
                      req.body.title +
                      '.png';

                    imgs.push(
                      "('" + imagesName + "'," + index + ',' + serviceID + ')'
                    );

                    let path =
                      './client/public/assets/uploads/users/' +
                      req.user.username;
                    if (!fs.existsSync(path)) {
                      fs.mkdirSync(path);

                      path += '/serviceImages/';
                      if (!fs.existsSync(path)) {
                        fs.mkdirSync(path);
                      }
                    }

                    path =
                      '../../../client/public/assets/uploads/users/' +
                      req.user.username +
                      '/serviceImages/';

                    fs.writeFile(
                      __dirname + path + imagesName,
                      base64Image,
                      { encoding: 'base64' },
                      function (err) {
                        if (err) console.log(err);
                        console.log('File created');
                      }
                    );
                  });

                  connection.query(
                    "delete from services_images where service_id='" +
                      serviceID +
                      "'",
                    function (error, results, fields) {}
                  );

                  const sql1 =
                    'INSERT INTO services_images (image_path,image_position,service_id) values ' +
                    imgs.join(',');
                  console.log(sql1);
                  connection.query(sql1, function (error, results, fields) {
                    if (error) console.log(error);
                    if (results.affectedRows != 0) {
                      return res.json({ done: true });
                    } else {
                      return res.json({
                        done: false,
                        msg: 'Server error! please contact to support for help',
                      });
                    }
                  });
                } else {
                  return res.json({
                    done: false,
                    msg: 'Server error! please contact to support for help',
                  });
                }
              });
            } else {
              return res.json({
                done: false,
                msg: 'you are not allowed to edit this service',
              });
            }
          } else {
            return res.json({
              done: false,
              msg: 'Service not found',
            });
          }
        }
      );
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('server error', err.message);
    }
  }
);

//  @route  GET api/service/user/services/count
//  @desc   get all posts
//  @access Private
router.get('/user/services/count', [auth], async (req, res) => {
  try {
    const userId = req.user.id;
    const sql =
      "SELECT concat(status,'-',COUNT(id)) as data FROM seller_services WHERE status!='' and user_id='" +
      userId +
      "'  GROUP BY status";

    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log(error.message);
      }

      if (results.length > 0) {
        let data = {};
        results.forEach((e) => {
          console.log(e);
          const d = e.data.split('-');
          data = {
            ...data,
            [d[0]]: d[1],
          };
        });
        return res.json({ found: true, data: data });
      } else {
        return res.json({ found: false, data: null });
      }
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

//  @route  POst api/service/pause
//  @desc   pause servie
//  @access Private
router.post('/pause/', [auth], async (req, res) => {
  try {
    const id = req.body.id;
    const userId = req.user.id;
    console.log(id);
    // check services is exists or not
    connection.query(
      "SELECT id,STATUS FROM seller_services WHERE id='" +
        id +
        "' and user_id='" +
        userId +
        "'",
      function (error, results, fields) {
        if (error) {
          console.log(error.message);
        }
        if (results.length > 0) {
          // check service is active or not
          if (results[0].STATUS === 'active') {
            const sql =
              "UPDATE seller_services SET status='paused' WHERE id='" +
              id +
              "'";
            connection.query(sql, function (error, results, fields) {
              if (error) {
                console.log(error.message);
              }

              if (results.affectedRows) {
                let data = {};
                return res.json({
                  done: true,
                  msg: 'service is pause successfully',
                  type: 'success',
                });
              } else {
                return res.json({
                  done: false,
                  msg: 'server error.somthing went wrong! ',
                  type: 'danger',
                });
              }
            });
          } else {
            return res.json({
              done: false,
              msg: 'server error.somthing went wrong! ',
              type: 'danger',
            });
          }

          // res.json({ found: true,data:data });
        } else {
          return res.json({
            done: false,
            msg: 'server error.somthing went wrong! ',
            type: 'danger',
          });
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

//  @route  POst api/service/active
//  @desc   pause servie
//  @access Private

router.post('/active/', [auth], async (req, res) => {
  try {
    const id = req.body.id;
    // check services is exists or not
    connection.query(
      "SELECT id,STATUS FROM seller_services WHERE id='" +
        id +
        "' and user_id='" +
        req.user.id +
        "'",
      function (error, results, fields) {
        if (error) {
          console.log(error.message);
        }
        if (results.length > 0) {
          if (results[0].STATUS === 'paused') {
            const sql =
              "UPDATE seller_services SET status='active' WHERE id='" +
              id +
              "'";
            connection.query(sql, function (error, results, fields) {
              if (error) {
                console.log(error.message);
              }

              if (results.affectedRows) {
                let data = {};
                return res.json({
                  done: true,
                  msg: 'Service is Activated successfully',
                  type: 'success',
                });
              } else {
                return res.json({
                  done: false,
                  msg: 'server error.somthing went wrong! ',
                  type: 'danger',
                });
              }
            });
          } else {
            return res.json({
              done: false,
              msg: 'server error.somthing went wrong! ',
              type: 'danger',
            });
          }

          // res.json({ found: true,data:data });
        } else {
          return res.json({
            done: false,
            msg: 'server error.somthing went wrong! ',
            type: 'danger',
          });
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

//  @route  GET api/service/user/services/count
//  @desc   get all posts
//  @access Private

router.post('/delete/', [auth], async (req, res) => {
  try {
    const id = req.body.id;
    console.log(id);
    // check services is exists or not
    connection.query(
      "SELECT id,STATUS FROM seller_services WHERE id='" +
        id +
        "' and user_id='" +
        req.user.id +
        "'",
      function (error, results, fields) {
        if (error) {
          console.log(error.message);
        }
        if (results.length > 0) {
          const sql =
            "UPDATE seller_services SET status='deleted' WHERE id='" + id + "'";
          connection.query(sql, function (error, results, fields) {
            if (error) {
              console.log(error.message);
            }

            if (results.affectedRows) {
              let data = {};
              return res.json({
                done: true,
                msg: 'Service is deleted successfully',
                type: 'success',
              });
            } else {
              return res.json({
                done: false,
                msg: 'server error.somthing went wrong! ',
                type: 'danger',
              });
            }
          });

          // res.json({ found: true,data:data });
        } else {
          return res.json({
            done: false,
            msg: 'server error.somthing went wrong! ',
            type: 'danger',
          });
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

//  @route  GET api/posts
//  @desc   get all posts
//  @access Private

router.get('/user/services/:type', [auth], async (req, res) => {
  try {
    // console.log(req.session);

    const type = req.params.type;
    const userId = req.user.id;
    const sql =
      "select ss.id,group_concat('/assets/uploads/users/',u.username,'/serviceImages/',si.image_path)  as images ,ss.title,ss.url_title,u.username from seller_services ss inner join services_images si on ss.id=si.service_id inner join users u on u.id=ss.user_id where ss.status='" +
      type +
      "'     and u.id='" +
      userId +
      "' group by si.service_id";

    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log(error.message);
      }

      if (results.length > 0) {
        return res.json({ found: true, data: results });
      } else {
        return res.json({ found: false, data: null });
      }
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

//  @route  GET api/service/:title
//  @desc   get  service by title
//  @access Private

router.post('/get-offer-data', [auth], async (req, res) => {
  try {
    // console.log(req.session);

    const seller = req.body.seller;
    const msgId = req.body.offerId;
    console.log(seller);
    let previousChat = await Chat.findOne({
      $or: [
        { participant1: req.user.username, participant2: seller },
        { participant2: req.user.username, participant1: seller },
      ],
    });

    let offerData;
    if (previousChat) {
      offerData = previousChat.messages.filter((msg) => {
        if (msg.id === msgId) {
          offerData = msg;
          return msg;
        }
      });
    }

    // console.log(previousChat)

    const serviceId = offerData[0].Offer[0]['serviceId'];

    const sql =
      "select ss.id,group_concat('/assets/uploads/users/',u.username,'/serviceImages/',si.image_path)  as images ,ss.title,ss.url_title from seller_services ss inner join services_images si on ss.id=si.service_id inner join users u on u.id=ss.user_id where ss.status='active'  and ss.id='" +
      serviceId +
      "'";

    console.log(sql);
    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log(error.message);
      }
      results[0]['offerDetails'] = offerData[0].Offer[0];

      if (results.length > 0) {
        return res.json({ found: true, data: results[0] });
      } else {
        return res.json({ found: false, data: null });
      }
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

//  @route  GET api/service/:title
//  @desc   get  service by title
//  @access Private

router.post('/create-session-id', [auth], async (req, res) => {
  try {
    // console.log(req.session);

    const seller = req.body.seller;
    const buyer = req.user.username;
    const offerId = req.body.offerId;

    const session = new PaymentSession({
      seller: seller,
      buyer: buyer,
      offerId: offerId,
    });
    session.save((err, sn) => {
      if (sn) {
        return res.json({ found: true, sessionID: sn._id });
      } else {
        return res.json({ found: false });
      }
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

router.post('/get-session-data', [auth], async (req, res) => {
  try {
    const sessionId = req.body.sessionID;
    const data = await PaymentSession.findOne({ _id: sessionId });
    console.log(data);
    const seller = data.seller;
    const msgId = data.offerId;
    console.log(seller);
    let previousChat = await Chat.findOne({
      $or: [
        { participant1: req.user.username, participant2: seller },
        { participant2: req.user.username, participant1: seller },
      ],
    });

    let offerData;
    if (previousChat) {
      offerData = previousChat.messages.filter((msg) => {
        if (msg.id === msgId) {
          offerData = msg;
          return msg;
        }
      });
    }

    const serviceId = offerData[0].Offer[0]['serviceId'];

    const sql =
      "select ss.id,group_concat('/assets/uploads/users/',u.username,'/serviceImages/',si.image_path)  as images ,ss.title,ss.url_title from seller_services ss inner join services_images si on ss.id=si.service_id inner join users u on u.id=ss.user_id where ss.status='active'  and ss.id='" +
      serviceId +
      "';select bfd.personal_balance from  buyer_finance_details bfd where bfd.user_id='" +
      req.user.id +
      "';select amount,service_fee_in_percent from buyer_order_fee_fixed";
    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log(error.message);
      }

      results[0][0]['offerDetails'] = offerData[0].Offer[0];
      results[0][0]['personal_balance'] = results[1][0].personal_balance;
      let sum = 0;
      if (results[2][0].amount >= results[0][0]['offerDetails'].amount) {
        sum =
          results[0][0]['offerDetails'].amount *
          (results[2][0].service_fee_in_percent / 100);
      }
      if (results[2][0].amount < results[0][0]['offerDetails'].amount) {
        sum =
          results[2][0].amount * (results[2][0].service_fee_in_percent / 100);
        let remaing =
          results[0][0]['offerDetails'].amount - results[2][0].amount;
        sum = sum + remaing * (results[2][1].service_fee_in_percent / 100);
      }

      results[0][0]['serviceFee'] = sum;
      results[0][0]['showPaymentMethod'] = true;
      if (
        results[0][0]['personal_balance'] >=
        results[0][0]['offerDetails'].amount
      ) {
        results[0][0]['showPaymentMethod'] = false;
      }
      results[0][0]['total'] =
        parseFloat(results[0][0]['offerDetails'].amount) +
        parseFloat(results[0][0]['serviceFee']);
      results[0][0]['remaining'] =
        parseFloat(results[0][0]['total']) - results[0][0]['personal_balance'];
      if (results.length > 0) {
        return res.json({ found: true, data: results[0][0] });
      } else {
        return res.json({ found: false, data: null });
      }
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

router.post('/get-session-data-users', async (req, res) => {
  try {
    const sessionId = req.body.sessionID;
    console.log(sessionId);
    const data = await PaymentSession.findOne({ _id: sessionId });
    const seller = data.seller;
    const buyer = data.buyer;
    const msgId = data.offerId;

    let previousChat = await Chat.findOne({
      $or: [
        { participant1: buyer, participant2: seller },
        { participant2: buyer, participant1: seller },
      ],
    });

    let offerData;
    if (previousChat) {
      offerData = previousChat.messages.filter((msg) => {
        if (msg.id === msgId) {
          offerData = msg;
          return msg;
        }
      });
    }

    // console.log(previousChat)

    const serviceId = offerData[0].Offer[0]['serviceId'];
    const data1 = offerData[0].Offer[0];

    if (data) {
      let f = { ...data._doc, serviceID: serviceId, ...data1._doc };

      console.log(f);
      return res.json({ found: true, data: f });
    } else {
      return res.json({ found: false, data: null });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});
//  @route  GET api/service/:title
//  @desc   get  service by title
//  @access Private

router.get('/get-service-fee-data', async (req, res) => {
  try {
    const sql =
      'select amount,service_fee_in_percent from buyer_order_fee_fixed';

    console.log(sql);
    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log(error.message);
      }

      if (results.length > 0) {
        return res.json({ found: true, data: results });
      } else {
        return res.json({ found: false, data: null });
      }
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

//  @route  GET api/service/:title
//  @desc   get  service by title
//  @access Public

router.get('/get-user-services/:username/', async (req, res) => {
  try {
    const username = req.params.username;

    const sql =
      "SELECT ss.id,ss.title,ss.description,u.username,group_concat('/assets/uploads/users/',u.username,'/serviceImages/',si.image_path)  as images,concat('/assets/uploads/users/',u.username,'/profileImages/',u.profile_image) as profile_image, ss.id as serviceId FROM seller_services ss INNER JOIN services_images si ON si.service_id=ss.id  inner join users u on ss.user_id=u.id WHERE  u.username='" +
      username +
      "' and ss.status='active' GROUP BY ss.id";

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

router.get('/:username/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const username = req.params.username;

    // get servie
    const sql =
      "SELECT ss.id,ss.title,ss.url_title,ss.price,ss.delivery_time,ss.description,u.fname,u.lname,u.story,u.username,group_concat('/assets/uploads/users/',u.username,'/serviceImages/',si.image_path)  as images,concat('/assets/uploads/users/',u.username,'/profileImages/',u.profile_image) as profile_image,bc.cat_name,sc.subcat_name,ss.subcat_id,ss.cat_id FROM seller_services ss INNER JOIN services_images si ON si.service_id=ss.id  inner join users u on ss.user_id=u.id inner join business_categories bc on bc.cat_id=ss.cat_id inner join sub_categories sc on sc.sub_cat_id=ss.subcat_id  WHERE ss.url_title='" +
      title +
      "' and u.username='" +
      username +
      "' and ss.status='active' GROUP BY ss.id limit 1";

    connection.query(sql, function (error, results11, fields) {
      if (error) {
        console.log(error.message);
      }

      console.log(results11);
      if (results11.length > 0) {
        // other serices
        const sql =
          "SELECT ss.id,ss.title,ss.url_title,ss.description,u.fname,u.lname,u.story,u.username,group_concat('/assets/uploads/users/',u.username,'/serviceImages/',si.image_path)  as images,concat('/assets/uploads/users/',u.username,'/profileImages/',u.profile_image) as profile_image FROM seller_services ss INNER JOIN services_images si ON si.service_id=ss.id  inner join users u on ss.user_id=u.id  WHERE  u.username='" +
          username +
          "' and  ss.status='active' GROUP BY ss.id";
        let otherServices = [];

        connection.query(sql, function (error, results, fields) {
          if (error) {
            console.log(error.message);
          }

          if (results.length > 0) {
            otherServices = results;

            const results1 = {
              ...results11[0],
              otherServices: results,
            };

            // console.log(otherServices);
            // console.log(results1);

            return res.json({ found: true, data: [results1] });
          } else {
            return res.json({ found: false, data: null });
          }
        });
      }
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

//  @route  GET api/service/:title
//  @desc   get  service by title
//  @access Private
router.get('/:title', async (req, res) => {
  try {
    const title = req.params.title;

    const sql =
      "SELECT ss.id,ss.title,ss.url_title,ss.description,ss.search_tags,ss.price,ss.delivery_time,ss.cat_id,ss.user_id,ss.subcat_id,ss.service_type,group_concat('/assets/uploads/users/',u.username,'/serviceImages/',si.image_path)  as images FROM seller_services ss INNER JOIN services_images si ON si.service_id=ss.id inner join users u on ss.user_id=u.id WHERE ss.url_title='" +
      title +
      "' GROUP BY ss.id";

    console.log(sql);
    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log(error.message);
      }

      if (results.length > 0) {
        return res.json({ found: true, data: results });
      } else {
        return res.json({ found: false, data: null });
      }
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

module.exports = router;
