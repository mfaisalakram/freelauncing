import * as atypes from "./types";
import axios from "axios";
import { setAlert } from "./alert";
import setAuthToken from "../../utills/setAuthToken";


export const getUserProfile = () => async dispatch => {

  dispatch({
    type: atypes.START_LOADING
  });
    setAuthToken();
     await axios
      .get("/api/profile/me")
      .then(response => {
        console.log(response.data);
        dispatch({
          type: atypes.GET_PROFILE,
          payload: response.data
        });
      })
      .catch(err => {
        console.log(err.response.data);
        dispatch({
          type: atypes.PROFILE_ERROR,
          payload:{msg:err.response.statusText,status:err.response.status}
        });
      });
 
};
export const getProfiles = () => async dispatch => {
 dispatch({type:atypes.CREATE_PROFILE});
  dispatch({
    type: atypes.START_LOADING
  });
    setAuthToken();
     await axios
      .get("/api/profile/all")
      .then(response => {
        console.log(response.data);
        dispatch({
          type: atypes.GET_PROFILES,
          payload: response.data
        });
      })
      .catch(err => {
        console.log(err.response.data);
        dispatch({
          type: atypes.PROFILE_ERROR,
          payload:{msg:err.response.statusText,status:err.response.status}
        });
      });
 
};

export const getProfileByID = (id) => async dispatch => {

  dispatch({
    type: atypes.START_LOADING
  });
    setAuthToken();
     await axios
      .get(`/api/profile/user/${id}`)
      .then(response => {
        console.log(response.data);
        dispatch({
          type: atypes.GET_PROFILE,
          payload: response.data
        });
        console.log("profile Data");
        console.log(response.data);
      })
      .catch(err => {
        console.log(err.response.data);
        dispatch({
          type: atypes.PROFILE_ERROR,
          payload:{msg:err.response.statusText,status:err.response.status}
        });
      });
 
};

export const getProfileRepos = username => async dispatch => {

  dispatch({
    type: atypes.START_LOADING
  });
    setAuthToken();
     await axios
      .get(`/api/profile/github/${username}`)
      .then(response => {
        console.log(response.data);
        dispatch({
          type: atypes.GET_REPOS,
          payload: response.data
        });
      })
      .catch(err => {
        console.log(err.response.data);
        dispatch({
          type: atypes.PROFILE_ERROR,
          payload:{msg:err.response.statusText,status:err.response.status}
        });
      });
 
};

export const createProfile= (formData,history,edit)=> async dispatch=>{

    const config={
        headers:{
            'Content-Type':'application/json'
        }
    }
    await axios
    .post("/api/profile",formData,config)
    .then(response => {
      console.log(response.data);
      dispatch({
        type: atypes.GET_PROFILE,
        payload: response.data
      });

      dispatch(setAlert(edit?'Profile Updated':'Profile Created','success'));
      history.push('/dashboard');

      

    
    })
    .catch(err => {
      const error=err.response.data.error
     if(error){
      error.forEach((e)=>dispatch(setAlert(e.msg, "danger")));
     }

      dispatch({
        type: atypes.PROFILE_ERROR,
        payload:{msg:err.response.statusText,status:err.response.status}
      });
    });

}

export const addExperience= (formData,history)=> async dispatch=>{

  const config={
      headers:{
          'Content-Type':'application/json'
      }
  }
  await axios
  .put("/api/profile/experience",formData,config)
  .then(response => {
    console.log(response.data);
    dispatch({
      type: atypes.UPDATE_PROFILE,
      payload: response.data
    });

    dispatch(setAlert('Experience Added','success'));
    history.push('/dashboard');

    

  
  })
  .catch(err => {
    const error=err.response.data.error
   if(error){
    error.forEach((e)=>dispatch(setAlert(e.msg, "danger")));
   }

    dispatch({
      type: atypes.PROFILE_ERROR,
      payload:{msg:err.response.statusText,status:err.response.status}
    });
  });

}

export const addEducation= (formData,history)=> async dispatch=>{

  const config={
      headers:{
          'Content-Type':'application/json'
      }
  }
  await axios
  .put("/api/profile/education",formData,config)
  .then(response => {
    console.log(response.data);
    dispatch({
      type: atypes.UPDATE_PROFILE,
      payload: response.data
    });

    dispatch(setAlert('Education Added','success'));
    history.push('/dashboard');
  
  })
  .catch(err => {
    const error=err.response.data.error
   if(error){
    error.forEach((e)=>dispatch(setAlert(e.msg, "danger")));
   }

    dispatch({
      type: atypes.PROFILE_ERROR,
      payload:{msg:err.response.statusText,status:err.response.status}
    });
  });

}

export const deleteExperience= (id)=> async dispatch=>{

  
  await axios
  .delete(`/api/profile/experience/${id}`,)
  .then(response => {
    console.log(response.data);
    dispatch({
      type: atypes.UPDATE_PROFILE,
      payload: response.data
    });

    dispatch(setAlert('Experience Removed','success'));
   
  })
  .catch(err => {
    const error=err.response.data.error
   if(error){
    error.forEach((e)=>dispatch(setAlert(e.msg, "danger")));
   }

    dispatch({
      type: atypes.PROFILE_ERROR,
      payload:{msg:err.response.statusText,status:err.response.status}
    });
  });

}

export const deleteEducation= (id)=> async dispatch=>{

  
  await axios
  .delete(`/api/profile/education/${id}`,)
  .then(response => {
    console.log(response.data);
    dispatch({
      type: atypes.UPDATE_PROFILE,
      payload: response.data
    });

    dispatch(setAlert('Education Deleted','success'));
   
  })
  .catch(err => {
    const error=err.response.data.error
   if(error){
    error.forEach((e)=>dispatch(setAlert(e.msg, "danger")));
   }

    dispatch({
      type: atypes.PROFILE_ERROR,
      payload:{msg:err.response.statusText,status:err.response.status}
    });
  });

}
