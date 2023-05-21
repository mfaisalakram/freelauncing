import *  as atypes from '../actions/types'
const initial_state=[]


export default function(state=initial_state,action){


   const {type,payload}=action;


    switch (type) {
        case atypes.SET_TOAST:
            return[...payload]
        case atypes.REMOVE_ALERT:
           
            return state.filter(alert=>alert.id!==payload.id)   
    
        default:
            return state;
    
    }
}