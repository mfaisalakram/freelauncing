import *  as atypes from '../actions/types'
const initial_state=[]


export default function(state=initial_state,action){
   const {type,payload}=action;
    switch (type) {
        case atypes.SET_ALERT:
            return[...state,payload]
        case atypes.REMOVE_ALERT:
            console.log(payload)
            return state.filter(alert=>alert.id!==payload.id)   
    
        default:
            return state;
    
    }
}