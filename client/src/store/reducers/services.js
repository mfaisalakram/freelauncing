import * as atypes from "../actions/types";


const initial_state = {
  services:[],
  loading: true,

};

export default function(state = initial_state, action) {
  const { type, payload } = action;
  switch (type) {

    case atypes.GET_SERVICES: 
      return {
        ...state,
        services:payload,
        loading: false
      };
     
    default:
        return state;
  
  }
}
