import * as atypes from "../actions/types";


const initial_state = {
  orders:[],
  loading: true,

};

export default function(state = initial_state, action) {
  const { type, payload } = action;
  switch (type) {

    case atypes.GET_ORDERS: 
      return {
        ...state,
        orders:payload,
        loading: false
      };
     
    default:
        return state;
  
  }
}
