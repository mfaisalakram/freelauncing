import React, { Fragment } from 'react';
import SideBar from '../../components/layout/SideBar';
import TopBar from '../../components/layout/TopBar';
import Footer from '../../components/layout/Footer';
import StyleKit from '../../components/layout/StyleKit';
import SupportKit from '../../components/layout/SupportKit';
import PathBar from '../../components/layout/PathBar';
import PriceCard from '../../components/UIComponents/PriceCard';
const MainContainer = () => {
  var data = {
    series: [
      {
        class: 'ct-series-a',
        data: [2, 11, 8, 14, 18, 20, 26],
      },
    ],
  };

  var options = {
    width: '120px',
    height: '107px',
    showPoint: true,
    showLine: true,
    showArea: true,
    fullWidth: true,
    showLabel: false,
    axisX: {
      showGrid: false,
      showLabel: false,
      offset: 0,
    },
    axisY: {
      showGrid: false,
      showLabel: false,
      offset: 0,
    },
    chartPadding: 0,
    low: 0,
  };

  var type = 'Line';

  return (
    <Fragment>
      <div className="initial__loading"></div>
      <div className="cui__layout cui__layout--hasSider">
        {/* <SupportKit /> */}
        {/* <StyleKit /> */}
        <SideBar />

        <div className="cui__menuLeft__backdrop"></div>
        <div className="cui__layout">
          <TopBar />
          <div className="cui__layout__content">
            <PathBar />
            <div className="cui__utils__content">
              <div className="row">
                <div className="col-lg-12">
                  <div className="cui__utils__heading">
                    <strong className="text-uppercase font-size-16">
                      Today Statistics
                    </strong>
                  </div>
                  <div className="row">
                    <PriceCard
                      chartInfo={{ data: data, type: type, options: options }}
                      lable={'Transactions'}
                      price={1250}
                    />
                    <div className="col-xl-4">
                      <div className="card">
                        <div className="card-body position-relative overflow-hidden">
                          <div className="font-size-36 font-weight-bold text-dark mb-n2">
                            $256.12
                          </div>
                          <div className="text-uppercase">Income</div>
                          <div className="kit__c11-1__chartContainer">
                            <div className="kit__c11-1__chart ct-hidden-points"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4">
                      <div className="card">
                        <div className="card-body position-relative overflow-hidden">
                          <div className="font-size-36 font-weight-bold text-dark mb-n2">
                            $56.12
                          </div>
                          <div className="text-uppercase">Outcome</div>
                          <div className="kit__c11-2__chartContainer">
                            <div className="kit__c11-2__chart ct-hidden-points"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="cui__utils__heading">
                    <strong>LAST MONTH STATISTICS</strong>
                  </div>
                  <div className="row">
                    <div className="col-xl-3 col-lg-6">
                      <div className="card">
                        <div className="card-body">
                          <div className="font-weight-bold text-dark font-size-24">
                            78,367
                          </div>
                          <div>Total Sales</div>
                          <div className="kit__c4__chart height-200 ct-hidden-points"></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-6">
                      <div className="card">
                        <div className="card-body">
                          <div className="font-weight-bold text-dark font-size-24">
                            +90%
                          </div>
                          <div>Sales Rise</div>
                          <div className="kit__c4-1__chart height-200 ct-hidden-points"></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-6">
                      <div className="card">
                        <div className="card-body">
                          <div className="font-weight-bold text-dark font-size-24">
                            900
                          </div>
                          <div>Completed</div>
                          <div className="kit__c4-2__chart height-200 ct-hidden-points"></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-6">
                      <div className="card">
                        <div className="card-body">
                          <div className="font-weight-bold text-dark font-size-24">
                            $78.62M
                          </div>
                          <div>Paid in Crypto</div>
                          <div className="kit__c4-3__chart height-200 ct-hidden-points"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-header">
                      <div className="cui__utils__heading mb-0">
                        <strong>Recently Referrals</strong>
                      </div>
                      <div className="text-muted">
                        Block with important Recently Referrals information
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead className="thead-default">
                            <tr>
                              <th>Name</th>
                              <th>Position</th>
                              <th>Age</th>
                              <th>Office</th>
                              <th>Date</th>
                              <th>Salary</th>
                            </tr>
                          </thead>
                          <tr>
                            <td>Damon</td>
                            <td>5516 Adolfo Green</td>
                            <td>18</td>
                            <td>Littelhaven</td>
                            <td>2014/06/13</td>
                            <td>553.536</td>
                          </tr>
                          <tr>
                            <td>Miracle</td>
                            <td>176 Hirthe Squares</td>
                            <td>35</td>
                            <td>Ryleetown</td>
                            <td>2013/09/27</td>
                            <td>784.802</td>
                          </tr>
                          <tr>
                            <td>Torrey</td>
                            <td>1995 Richie Neck</td>
                            <td>15</td>
                            <td>West Sedrickstad</td>
                            <td>2014/09/12</td>
                            <td>344.302</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="cui__utils__heading">
                    <strong>Your cards (3)</strong>
                    <button className="ml-3 btn btn-outline-default btn-sm">
                      View All
                    </button>
                  </div>
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="card">
                        <div className="position-relative py-3 px-4 text-center">
                          <div className="kit__g17__flag">$560,245.35</div>
                          <div className="font-size-70 pt-3 pb-w text-gray-4">
                            <i className="fe fe-star"></i>
                          </div>
                          <h5 className="font-size-24 font-weight-bold mb-1">
                            David Beckham
                          </h5>
                          <div className="font-size-18 text-uppercase mb-3">
                            8748-XXXX-1678-5416
                          </div>
                          <div className="font-weight-bold font-size-18 text-uppercase mb-4">
                            MASTERCARD
                          </div>
                          <div className="border-top pt-3 font-italic">
                            Expires at 03/22
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="card">
                        <div className="position-relative py-3 px-4 text-center">
                          <div className="kit__g17__flag">$2,156.20</div>
                          <div className="font-size-70 pt-3 pb-w text-gray-4">
                            <i className="fe fe-star"></i>
                          </div>
                          <h5 className="font-size-24 font-weight-bold mb-1">
                            Matt Daemon
                          </h5>
                          <div className="font-size-18 text-uppercase mb-3">
                            8748-XXXX-1678-5416
                          </div>
                          <div className="font-weight-bold font-size-18 text-uppercase mb-4">
                            Visa
                          </div>
                          <div className="border-top pt-3 font-italic">
                            Expires at 03/22
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="card">
                        <div className="position-relative py-3 px-4 text-center">
                          <div className="kit__g17__flag">$10,2000.00</div>
                          <div className="font-size-70 pt-3 pb-w text-gray-4">
                            <i className="fe fe-star"></i>
                          </div>
                          <h5 className="font-size-24 font-weight-bold mb-1">
                            Angelina Jolie
                          </h5>
                          <div className="font-size-18 text-uppercase mb-3">
                            8748-XXXX-1678-5416
                          </div>
                          <div className="font-weight-bold font-size-18 text-uppercase mb-4">
                            Visa
                          </div>
                          <div className="border-top pt-3 font-italic">
                            Expires at 03/22
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="cui__utils__heading">
                    <strong>Your accounts (6)</strong>
                    <button className="ml-3 btn btn-outline-default btn-sm">
                      View All
                    </button>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="card">
                        <div className="py-3 px-4">
                          <div className="d-flex flex-wrap-reverse align-items-center pb-3">
                            <div className="mr-auto">
                              <div className="text-uppercase font-weight-bold font-size-24 text-dark">
                                US 4658-1657-1235
                              </div>
                              <div className="font-size-18">$2,156.78</div>
                            </div>
                            <div className="flex-shrink-0 font-size-36 text-gray-4 pl-1">
                              <i className="fe fe-server"></i>
                            </div>
                          </div>
                          <div className="font-italic font-size-14 text-center border-top pt-3">
                            Current month charged: 10,200.00
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="card">
                        <div className="py-3 px-4">
                          <div className="d-flex flex-wrap-reverse align-items-center pb-3">
                            <div className="mr-auto">
                              <div className="text-uppercase font-weight-bold font-size-24 text-dark">
                                IBAN 4658-1235-1567-8000
                              </div>
                              <div className="font-size-18">$12,136.78</div>
                            </div>
                            <div className="flex-shrink-0 font-size-36 text-gray-4 pl-1">
                              <i className="fe fe-server"></i>
                            </div>
                          </div>
                          <div className="font-italic font-size-14 text-center border-top pt-3">
                            Current month charged: 12,136.78
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="card">
                        <div className="py-3 px-4">
                          <div className="d-flex flex-wrap-reverse align-items-center pb-3">
                            <div className="mr-auto">
                              <div className="text-uppercase font-weight-bold font-size-24 text-dark">
                                IBAN 4658-1235-1567-8000
                              </div>
                              <div className="font-size-18">$12,136.78</div>
                            </div>
                            <div className="flex-shrink-0 font-size-36 text-gray-4 pl-1">
                              <i className="fe fe-server"></i>
                            </div>
                          </div>
                          <div className="font-italic font-size-14 text-center border-top pt-3">
                            Current month charged: 12,136.78
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="card">
                        <div className="py-3 px-4">
                          <div className="d-flex flex-wrap-reverse align-items-center pb-3">
                            <div className="mr-auto">
                              <div className="text-uppercase font-weight-bold font-size-24 text-dark">
                                US 4658-1657-1235
                              </div>
                              <div className="font-size-18">$2,156.78</div>
                            </div>
                            <div className="flex-shrink-0 font-size-36 text-gray-4 pl-1">
                              <i className="fe fe-server"></i>
                            </div>
                          </div>
                          <div className="font-italic font-size-14 text-center border-top pt-3">
                            Current month charged: 10,200.00
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="cui__utils__heading">
                    <strong>Recent transactions (167)</strong>
                    <button className="ml-3 btn btn-outline-default btn-sm">
                      View All
                    </button>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="card">
                        <div className="kit__g6 pt-3">
                          <div className="kit__g6__status bg-danger"></div>
                          <div className="d-flex flex-nowrap align-items-center pb-3 pl-4 pr-4">
                            <div className="mr-auto">
                              <div className="text-uppercase font-weight-bold font-size-24 text-dark">
                                -$1,125
                              </div>
                              <div className="font-size-18">
                                4512-XXXX-1678-7528
                              </div>
                            </div>
                            <div className="ml-1 text-danger">
                              <i className="fe fe-arrow-right-circle font-size-40"></i>
                            </div>
                          </div>
                          <div className="kit__g6__footer py-3 pl-4">
                            To DigitalOcean Cloud Hosting, Winnetka, LA
                          </div>
                        </div>
                      </div>
                      <div className="card">
                        <div className="kit__g6 pt-3">
                          <div className="kit__g6__status bg-success"></div>
                          <div className="d-flex flex-nowrap align-items-center pb-3 pl-4 pr-4">
                            <div className="mr-auto">
                              <div className="text-uppercase font-weight-bold font-size-24 text-dark">
                                +$10,264
                              </div>
                              <div className="font-size-18">
                                4512-XXXX-1678-7528
                              </div>
                            </div>
                            <div className="ml-1 text-success">
                              <i className="fe fe-arrow-left-circle font-size-40"></i>
                            </div>
                          </div>
                          <div className="kit__g6__footer py-3 pl-4">
                            From Tesla Cars, Inc
                          </div>
                        </div>
                      </div>
                      <div className="card">
                        <div className="kit__g6 pt-3">
                          <div className="kit__g6__status bg-danger"></div>
                          <div className="d-flex flex-nowrap align-items-center pb-3 pl-4 pr-4">
                            <div className="mr-auto">
                              <div className="text-uppercase font-weight-bold font-size-24 text-dark">
                                -$1,125
                              </div>
                              <div className="font-size-18">
                                4512-XXXX-1678-7528
                              </div>
                            </div>
                            <div className="ml-1 text-danger">
                              <i className="fe fe-arrow-right-circle font-size-40"></i>
                            </div>
                          </div>
                          <div className="kit__g6__footer py-3 pl-4">
                            To DigitalOcean Cloud Hosting, Winnetka, LA
                          </div>
                        </div>
                      </div>
                      <div className="card">
                        <div className="kit__g6 pt-3">
                          <div className="kit__g6__status bg-success"></div>
                          <div className="d-flex flex-nowrap align-items-center pb-3 pl-4 pr-4">
                            <div className="mr-auto">
                              <div className="text-uppercase font-weight-bold font-size-24 text-dark">
                                +$10,264
                              </div>
                              <div className="font-size-18">
                                4512-XXXX-1678-7528
                              </div>
                            </div>
                            <div className="ml-1 text-success">
                              <i className="fe fe-arrow-left-circle font-size-40"></i>
                            </div>
                          </div>
                          <div className="kit__g6__footer py-3 pl-4">
                            From Tesla Cars, Inc
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center pb-5">
                    <button className="btn disabled btn-primary width-200">
                      Load More...
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </Fragment>
  );
};

export default MainContainer;
