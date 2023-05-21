import React from 'react'
import ChartistGraph from 'react-chartist';
const PriceCard = ({chartInfo:{data,options,type},lable,price}) => {
    return (
           
        <div className="col-xl-4">
        <div className="card">
          <div className="card-body position-relative overflow-hidden">
            <div className="font-size-36 font-weight-bold text-dark mb-n2">
              {price}
            </div>
    <div className="text-uppercase">{lable}</div>
            <div className="kit__c11__chartContainer">
              <div className="kit__c11__chart ct-hidden-points">
              <ChartistGraph data={data} options={options} type={type} />

              </div>
            </div>
          </div>
     


        </div>
      </div>
    
    )
}



export default PriceCard
