import * as atypes from "../actions/types";


const initial_state = {
  profile:null,
  services:null,
  loading: true,
};

export default function(state = initial_state, action) {
  const { type, payload } = action;
  switch (type) {
    case atypes.GET_PROFILE:
    case atypes.UPDATE_PROFILE: 
      return {
        ...state,
        profile:payload,
        loading: false
      };
    case atypes.GET_PROFILES: 
      return {
        ...state,
        profiles:payload,
        loading: false
      };
      case atypes.GET_REPOS: 
      return {
        ...state,
        repos:payload,
        loading: false
      };  
    case atypes.PROFILE_ERROR:
      return{
        ...state,
        error:payload,
        loading:false
      }

    case atypes.START_LOADING:
      return{
        ...state,
        loading:true
      }
      case atypes.CLEAR_PROFILE:  
        return{
          ...state,
          profile:null,
          repos:[],
          error:{},
          loading:false
        }
    default:
        return state;
  
  }
}
