  import * as atypes from "../actions/types";


const initial_state = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: false,
  user: null
};

export default function(state = initial_state, action) {
  const { type, payload } = action;
  switch (type) {
    case atypes.REGISTER_SUCCESS:
      return {
        ...state,
        ...payload,
        isAuthenticated: false,
        loading: false
      };
    case atypes.LOAD_USER:
      return{
        ...state,
        isAuthenticated:true,
        loading:false,
        user:payload
      }
    case atypes.LOGIN_SUCCESS:
      return{
        ...state,
        isAuthenticated:true,
        loading:false,
      }
    case atypes.START_LOADING:
      return{
        ...state,
        loading:true
      } 

    case atypes.REGISTER_FAIL:
    case atypes.AUTH_ERROR:
    case atypes.LOGIN_ERROR:
    case atypes.LOGOUT: 
    case atypes.ACCOUNT_DELETED: 
        
        return{
            ...state,
            user:null,
            isAuthenticated:false,
            loading:false

        }
    default:
        return state;
  
  }
}
