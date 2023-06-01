import axios from "axios";
import {
    CUSTOMER_USER_LOADED,
    CUSTOMER_USER_FAILED,  
    OWNER_USER_LOADED,
    OWNER_USER_FAILED,
    LOGIN_FAILED,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    REGISTER_CUSER_SUCCESS,
    REGISTER_FUSER_FAILED,
    REGISTER_FUSER_SUCCESS,
    REGISTER_CUSER_FAILED,
    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_FAIL,
    PASSWORD_RESET_CONFIRM_SUCCESS,
    PASSWORD_RESET_CONFIRM_FAIL,
    PASSWORD_CHANGE_FAIL,
    PASSWORD_CHANGE_SUCCESS
} from "../actions/types"



export const getCustomerUser=()=>(dispatch, getState)=>{
    const access_token = getState().auth.access_token
    // const access_token = getState().auth.access_token
    const isCustomer= getState().auth.isCustomer
    console.log(isCustomer)
    console.log(access_token)
    const config={
        headers:{
            'Content-type':'application/json',
            'Accept': 'application/json'
        }
    }

    if(access_token && isCustomer){
        config.headers['Authorization'] = `Bearer ${access_token}`; 
    }
    
    axios.get('http://127.0.0.1:8000/api/customer/dashboard', config)
    .then(res =>{
        dispatch({
            type:CUSTOMER_USER_LOADED,
            payload:res.data
        })
    }).catch(err =>{
        dispatch({
            type:CUSTOMER_USER_FAILED
        })
    })
}

console.log(CUSTOMER_USER_LOADED)

// check token and load freelance user
export const getOwnerUser = ()=>(dispatch, getState)=>{
    const access_token = getState().auth.access_token
    const isOwner=getState().auth.isOwner
    const config={
        headers:{
            'Content-Type':'application/json'
        }
    }
    console.log(isOwner)
    if(access_token && isOwner){
        config.headers['Authorization'] = `Bearer ${access_token}`;
    }

    axios.get('http://127.0.0.1:8000/api/owner/dashboard', config)
        .then(res =>{
            dispatch({
                type:OWNER_USER_LOADED,
                payload:res.data
            })
        }).catch(err => {
            dispatch({
                type:OWNER_USER_FAILED
            })
        })
}
        

export const create_customeruser=({username, email,password, password2, tc})=>(dispatch)=>{
    const config={
        headers:{
            'Content-Type':'application/json'
        }
    }
    const body=JSON.stringify({username, email, password, password2, tc})

    axios.post('http://127.0.0.1:8000/api/signup/customer/', body, config)
    .then(res =>{
        dispatch({
            type:REGISTER_CUSER_SUCCESS,
            payload:res.data
        })
        console.log(res.data)
    }).catch(err =>{
        dispatch({
            type:REGISTER_CUSER_FAILED
        })
        console.log(err.response.data)
    })

    
}


export const create_owneruser=({username, email,password, password2, tc})=>(dispatch)=>{
    const config={
        headers:{
            'Content-Type':'application/json'
        }
    }
    const body=JSON.stringify({username, email, password, password2, tc})

    axios.post('http://127.0.0.1:8000/api/signup/owner/', body, config)
    .then(res =>{
        dispatch({
            type:REGISTER_FUSER_SUCCESS,
            payload:res.data
        })
        console.log(res.data)
    }).catch(err =>{
        dispatch({
            type:REGISTER_FUSER_FAILED
        })
        console.log(err.response.data)
    })

    
}


export const login=({email, password})=>(dispatch)=>{
    const config={
        headers:{
            'Content-Type':'application/json'
        }
    }
    const body=JSON.stringify({email, password})

    axios.post('http://127.0.0.1:8000/api/login/', body, config)
    .then(response =>{
        dispatch({
            type:LOGIN_SUCCESS,
            payload:response.data,
            
            
        })
        // dispatch(getCustomerUser());
    }).catch(err =>{
        dispatch({
            type:LOGIN_FAILED
        })
    })

}
console.log(LOGIN_SUCCESS)

export const logout=()=>(dispatch, getState)=>{
    const access_token=getState().auth.access_token
    console.log(access_token)
    const config={
        headers:{
            'Content-Type':'application/json'
        }
    }

    if(access_token){
        config.headers['Authorization']= `Bearer ${access_token}`
    }
    axios.post('http://127.0.0.1:8000/api/logout/', null, config)
    .then(res =>{
        dispatch({
            type:LOGOUT_SUCCESS
        })
    }).catch(err =>{
        console.log(err.response.data)
    })
}

export const sendPasswordResetEmail = (email) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email });

    try {
        await axios.post(`http://127.0.0.1:8000/api/send-reset-password-email/`, body, config);

        dispatch({
            type: PASSWORD_RESET_SUCCESS
        });
    } catch (err) {
        dispatch({
            type: PASSWORD_RESET_FAIL
        });
    }
};
  
  export const change_user_password  = (password, password2) => async (dispatch, getState) => {
    const access_token = getState().auth.access_token;
    const UserId = getState().auth.userId;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${access_token}`,
      }
    };
  
    const body = JSON.stringify({ password, password2 });
  
    try {
      await axios.post(`http://127.0.0.1:8000/api/changepassword/`, body, config);
            dispatch({
                type: PASSWORD_CHANGE_SUCCESS
            });
        } catch (err) {
            dispatch({
                type: PASSWORD_CHANGE_FAIL
            });
        }
      
  };
  

  export const reset_password = (id, token, password, password2) => async (dispatch) => {
    // const { access } = getState().auth.token;
    // const userId = getState().auth.userId;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${access}`
      }
    };
//   console.log(access)
    const body = JSON.stringify({ id, token, password, password2 });
  
    try {
      await axios.post(`http://127.0.0.1:8000/api/reset-password/${id}/${token}/`, body, config);
  
     
    dispatch({
        type: PASSWORD_RESET_CONFIRM_SUCCESS
    });
} catch (err) {
    dispatch({
        type: PASSWORD_RESET_CONFIRM_FAIL
    });
}
  };
  
  

