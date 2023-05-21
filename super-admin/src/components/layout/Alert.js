import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
const Alert = (props) => {
   let alertsX=null;
   console.log(props.alerts)
    if(props.alerts!==null && props.alerts.length>0){
       alertsX=props.alerts.map(alert=>{
       return <div key={alert.id} className={`alert alert-${alert.alertType}`} >{alert.msg}</div>
       })
    }
    
    return (
        <div>
            {alertsX}
        </div>
    )
}

Alert.propTypes = {

}
const mapStatetoprops=state=>({
    alerts:state.alerts
})

export default connect(mapStatetoprops)(Alert)
