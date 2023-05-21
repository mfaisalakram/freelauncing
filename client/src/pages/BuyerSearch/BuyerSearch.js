import React, { useEffect, useState } from 'react';
import BuyerSearchService from '../../components/ServiceModel/BuyerSearchService/BuyerSearchService';
import axios from 'axios';
import './BuyerSearch.css';
import noResults from '../../img/no-result.png';
import $ from 'jquery';
import querySearch from 'stringquery';
import Spinner from '../../components/layout/Spinner';

const BuyerSearch = (props) => {
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
  const [servicesData, setservicesData] = useState([]);
  const [sellerLevels, setsellerLevels] = useState([]);
  const [sellerLevelsInputs, setsellerLevelsInputs] = useState({
    silver: true,
    gold: true,
    platinum: true,
    daimond: true,
  });
  const [bugdetInput, setbugdetInput] = useState({
    price_min: '',
    price_max: '',
  });
  const [sellerLanguages, setsellerLanguages] = useState([]);
  const [sellerCountries, setsellerCountries] = useState([]);
  const [keyword, setkeyword] = useState(getKeyvalue('keyword'));
  const [loading, setloading] = useState(true);
  const [searchCategories, setsearchCategories] = useState([]);

  const onSellerChange = (e, sellerType) => {
    let arr,
      arr2 = [];
    let query = getKeyvalue('seller_type');
    let found = false;
    if (query) {
      arr = query.split('-');
      arr.map((type) => {
        if (type === sellerType) {
          found = true;
          // console.log(e.target.checked);
          if (e.target.checked) {
            arr2.push(type);
          } else {
            arr2 = arr2.filter((f) => f !== type);
            console.log('filter');
          }
        } else {
          arr2.push(type);
        }
      });
      if (!found) {
        arr2.push(sellerType);
      }
    } else {
      if (e.target.checked) {
        arr2.push(sellerType);
      } else {
        return;
      }
    }

    addOrEditParams('seller_type', arr2.join('-'));

    setsellerLevelsInputs({
      ...sellerLevelsInputs,
      [sellerType]: !sellerLevelsInputs[sellerType],
    });
  };
  console.log(props.location.pathname, 'path');
  if (props.location.pathname === '/') {
    window.location.href = '/services/search';
  }
  const clearFilersAll = () => {
    window.location.href = '/services/search';
  };
  const onLanguageChange = (e, lang) => {
    let arr,
      arr2 = [];
    let query = getKeyvalue('seller_languages');
    let found = false;
    if (query) {
      arr = query.split('-');
      console.log(arr);
      arr.map((type) => {
        //if found
        if (type === lang) {
          found = true;
          //to addd
          if (e.target.checked) {
            arr2.push(type);
          } else {
            //to remove
            arr2 = arr2.filter((f) => f !== type);
          }
        } else {
          arr2.push(type);
        }
      });
      if (!found) {
        arr2.push(lang);
      }
    } else {
      if (e.target.checked) {
        arr2.push(lang);
      } else {
      }
    }

    addOrEditParams('seller_languages', arr2.join('-'));

    // props.history.push('/services/search?seller_type='+)
    // console.log("4545",)

    // setsellerLevelsInputs({
    //   ...sellerLevelsInputs,
    //   [sellerType]: !sellerLevelsInputs[]
    // });
  };

  const onCountryChange = (e, country) => {
    let arr,
      arr2 = [];
    let query = getKeyvalue('seller_country');
    let found = false;
    if (query) {
      arr = query.split('-');
      console.log(arr);
      arr.map((type) => {
        //if found
        if (type === country) {
          found = true;
          //to addd
          if (e.target.checked) {
            arr2.push(type);
          } else {
            //to remove
            arr2 = arr2.filter((f) => f !== type);
          }
        } else {
          arr2.push(type);
        }
      });
      if (!found) {
        arr2.push(country);
      }
    } else {
      if (e.target.checked) {
        arr2.push(country);
      } else {
      }
    }

    addOrEditParams('seller_country', arr2.join('-'));
  };

  const getservices = (queryParams = '') => {
    setloading(true);

    axios
      .get(props.baseUrl + '/api/service/search' + queryParams)
      .then((response) => {
        setloading(false);
        setservicesData(response.data.data.services);
        setsearchCategories(response.data.data.categories);
        setsellerLevels(response.data.data.sellerlevels);
        setsellerLanguages(response.data.data.sellerlanguages);
        setsellerCountries(response.data.data.sellerCountries);
        console.log('yomo', servicesData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  $('.box').addClass('none');
  $('.box1').addClass('none');

  const checkValueInParams = (k, v) => {
    let found = false;
    const kk = getKeyvalue(k);
    if (kk) {
      kk.split('-').map((value) => {
        if (value === v) {
          found = true;
        }
      });
    }

    return found;
  };

  const paramsToStates = (params) => {
    if (params === 'seller_type') {
      let ob = {
        silver: true,
        gold: true,
        platinum: true,
        daimond: true,
      };
      const k = getKeyvalue('seller_type');
      if (k) {
        k.split('-').map((type) => {
          if (type === 'daimond') {
            ob.daimond = false;
          }
          if (type === 'gold') {
            ob.gold = false;
          }
          if (type === 'silver') {
            ob.silver = false;
          }
          if (type === 'platinum') {
            ob.platinum = false;
          }
        });

        console.log(ob);
        setsellerLevelsInputs(ob);
      }
    } else if (params === 'seller_languages') {
      let ob = [];

      const k = getKeyvalue('seller_languages');
      if (k) {
        // k.split("-").map(type => {
        //   if (type === "daimond") {
        //     ob.daimond = false;
        //   }  if (type === "gold") {
        //     ob.gold = false;
        //   }  if (type === "silver") {
        //     ob.silver = false;
        //   }  if (type === "platinum") {
        //     ob.platinum = false;
        //   }
        // });

        console.log(ob);
        setsellerLevelsInputs(ob);
      }
    }
  };
  useEffect(() => {
    paramsToStates('seller_type');
    getservices(decodeURI(props.location.search));

    // getCategories();
    $('.btn-filter1').on('click', function () {
      $(this).parent().find('.box').toggleClass('block');
      $('.box1').removeClass('block');
    });

    $('.btn-filter1').on('focusout', function () {
      setTimeout(() => {
        $(this).parent().find('.box').removeClass('block');
      }, 200);
    });

    $('.btn-filter-seller').on('click', function () {
      $(this).parent().find('.box1').toggleClass('block');
    });

    $('.apply').on('click', function () {
      // console.log("sss");
      setTimeout(() => {
        $('.box1').removeClass('block');
      }, 200);
    });
  }, []);

  const addOrEditParams = (k, v) => {
    const search = props.location.search;
    const query = querySearch(decodeURI(search));

    let stringQuery = [];
    let found = false;
    let newUrl = '';

    // console.log(Object.keys(query));
    if (Object.keys(query)[0] !== '') {
      Object.keys(query).map((key) => {
        if (k === key) {
          found = true;
          stringQuery.push(key + '=' + v);
        } else {
          stringQuery.push(key + '=' + query[key]);
        }
      });
      if (found) {
        newUrl = '/services/search?' + stringQuery.join('&');
      } else {
        stringQuery.push(k + '=' + v);
        newUrl = '/services/search?' + stringQuery.join('&');
      }
    } else {
      newUrl = '/services/search?' + k + '=' + v;
    }

    window.location.href = newUrl;
  };

  const onSearchChange = (e) => {
    setkeyword(e.target.value);
  };

  const onSearchSubmitButton = (e) => {
    getservices(keyword);
    addOrEditParams('keyword', keyword);
  };

  // get categores from server
  // const getCategories = async () => {
  //   await axios.get(props.baseUrl + '/api/raw/categories').then((response) => {
  //     if (response.data.found) {
  //       let data = response.data.data;
  //       data.unshift({ cat_id: '', cat_name: 'Select Category' });
  //       setsearchCategories(response.data.data);
  //     }
  //   });
  // };

  return (
    <div className="BuyerSearch">
      {loading && <Spinner cls="abs" />}

      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="search-box">
              <input
                type="text"
                name="keyword"
                value={keyword}
                onChange={onSearchChange}
              />
              <button
                className="btn btn-success"
                onClick={onSearchSubmitButton}
              >
                Search
              </button>

              {/* <div className="results">
                <ul></ul>
              </div> */}
            </div>
            {props.location.search !== '' ? (
              <p className="clearAll" onClick={(e) => clearFilersAll()}>
                Clear All Filters
              </p>
            ) : (
              ''
            )}
          </div>

          <div className="col-md-12">
            <div className="filters">
              <div className="categoryFilter inner-filter">
                <button className="btn-filter btn-filter1">
                  Category <i className="fa fa-caret-down"></i>
                </button>
                <div className="category-box box none">
                  <ul>
                    {searchCategories.map((op) => {
                      return (
                        <li>
                          <span
                            className="cat-name"
                            onClick={() => {
                              addOrEditParams('category', op.cat_id);
                            }}
                          >
                            {op.cat_name}
                          </span>{' '}
                          <span>({op.COUNT})</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <div className="SellerFilter inner-filter">
                <button className="btn-filter  btn-filter-seller">
                  Seller Details <i className="fa fa-caret-down"></i>
                </button>
                <div className="category-box box1 none">
                  <div className="content-scroll">
                    <div>
                      <div className="more-filter-item with-carrot">
                        <div className="content-title"> Seller Level </div>
                        <div className="checkbox-list">
                          <div className="row">
                            <div className="col-md-6 col-sm-6">
                              <label className="filter-label">
                                <input
                                  type="checkbox"
                                  name="daimond"
                                  value={sellerLevelsInputs.daimond}
                                  checked={!sellerLevelsInputs.daimond}
                                  onChange={(e) => onSellerChange(e, 'daimond')}
                                />
                                <span className="checkmark-box">
                                  <span className="fit-icon check-icon"></span>
                                </span>
                                <div className="inner-checkbox">
                                  <span className="filter-label">
                                    Top Rated - Daimond
                                  </span>

                                  <span className="count">
                                    (
                                    {sellerLevels?.length === 4
                                      ? sellerLevels[3].counts
                                        ? sellerLevels[3].counts
                                        : '0'
                                      : '0'}
                                    )
                                  </span>
                                </div>
                              </label>
                            </div>
                            <div className="col-md-6 col-sm-6">
                              <label className="filter-label">
                                <input
                                  type="checkbox"
                                  name="platinum"
                                  value={sellerLevelsInputs.platinum}
                                  checked={!sellerLevelsInputs.platinum}
                                  onChange={(e) =>
                                    onSellerChange(e, 'platinum')
                                  }
                                />

                                <div className="inner-checkbox">
                                  <span className="filter-label">
                                    Level Platinum
                                  </span>
                                  <span className="count">
                                    (
                                    {sellerLevels?.length === 4
                                      ? sellerLevels[2].counts
                                        ? sellerLevels[2].counts
                                        : '0'
                                      : '0'}
                                    )
                                  </span>
                                </div>
                              </label>
                            </div>
                            <div className="col-md-6 col-sm-6">
                              <label className="filter-label">
                                <input
                                  type="checkbox"
                                  name="gold"
                                  value={sellerLevelsInputs.gold}
                                  checked={!sellerLevelsInputs.gold}
                                  onChange={(e) => onSellerChange(e, 'gold')}
                                />
                                <span className="checkmark-box"></span>
                                <div className="inner-checkbox">
                                  <span className="filter-label">
                                    Level Gold
                                  </span>
                                  <span className="count">
                                    (
                                    {sellerLevels?.length === 4
                                      ? sellerLevels[1].counts
                                        ? sellerLevels[1].counts
                                        : '0'
                                      : '0'}
                                    )
                                  </span>
                                </div>
                              </label>
                            </div>
                            <div className="col-md-6 col-sm-6">
                              {' '}
                              <label className="filter-label">
                                <input
                                  type="checkbox"
                                  name="silver"
                                  value={sellerLevelsInputs.silver}
                                  checked={!sellerLevelsInputs.silver}
                                  onChange={(e) => onSellerChange(e, 'silver')}
                                />
                                <span className="checkmark-box"></span>
                                <div className="inner-checkbox">
                                  <span className="filter-label">
                                    New Seller - Silver
                                  </span>
                                  <span className="count">
                                    (
                                    {sellerLevels?.length === 4
                                      ? sellerLevels[0].counts
                                        ? sellerLevels[0].counts
                                        : '0'
                                      : '0'}
                                    )
                                  </span>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr />

                      <hr />
                      <div className="options"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="deliveryTimeFilter inner-filter">
                <button className="btn-filter btn-filter1">
                  Deliver Time <i className="fa fa-caret-down"></i>
                </button>
                <div className="category-box box none">
                  <div>
                    <label className="filter-label">
                      <input
                        type="radio"
                        name="time"
                        onChange={() => addOrEditParams('delivery_time', 1)}
                        checked={checkValueInParams('delivery_time', 1)}
                      />
                      <span>Express 24H</span>
                    </label>
                  </div>

                  <div>
                    <label>
                      <input
                        type="radio"
                        name="time"
                        onChange={() => addOrEditParams('delivery_time', 3)}
                        checked={checkValueInParams('delivery_time', 3)}
                      />

                      <span>Up to 3 days</span>
                    </label>
                  </div>
                  <div>
                    <label htmlFor="">
                      <input
                        type="radio"
                        name="time"
                        onChange={() => addOrEditParams('delivery_time', 7)}
                        checked={checkValueInParams('delivery_time', 7)}
                      />

                      <span>Up to 7 days</span>
                    </label>
                  </div>
                  <div>
                    <label htmlFor="">
                      <input
                        type="radio"
                        name="time"
                        onChange={() => addOrEditParams('delivery_time', 30)}
                        checked={checkValueInParams('delivery_time', 30)}
                      />

                      <span>Anytime</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="budgetFilter inner-filter">
                <button className="btn-filter btn-filter-seller">
                  Budget<i className="fa fa-caret-down"></i>
                </button>
                <div className="category-box box1 none">
                  <div className="min">
                    <label htmlFor="">
                      <h3>Min</h3>
                      <input
                        type="number"
                        name="price_min"
                        value={bugdetInput.price_min}
                        onChange={(e) =>
                          setbugdetInput({
                            ...bugdetInput,
                            price_min: e.target.value,
                          })
                        }
                      />
                    </label>
                  </div>

                  <div className="max">
                    <label htmlFor="">
                      <h3>Max</h3>
                      <input
                        type="text"
                        name="price_max"
                        value={bugdetInput.price_max}
                        onChange={(e) =>
                          setbugdetInput({
                            ...bugdetInput,
                            price_max: e.target.value,
                          })
                        }
                      />
                    </label>
                  </div>
                  <hr />
                  <div className="options">
                    <button className="apply">Clear Filter</button>
                    <button
                      onClick={() => {
                        if (bugdetInput.price_max) {
                          addOrEditParams('price_max', bugdetInput.price_max);
                        }
                        if (bugdetInput.price_min) {
                          addOrEditParams('price_min', bugdetInput.price_min);
                        }
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <h4>{servicesData.length} services available</h4>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : servicesData.length ? (
            servicesData.map((service, i) => {
              return (
                <div className="col-md-3 col-sm-6" key={i}>
                  <div className="service-inner">
                    <BuyerSearchService serviceData={service} />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="result-not-fount container text-center">
              <img src={noResults} alt="" />
              {/* <h3>No Services Found For Your Search</h3> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerSearch;
