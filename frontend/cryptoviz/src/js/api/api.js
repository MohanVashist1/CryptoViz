import Cookies from 'js-cookie';
import * as authConstants from '../constants/auth';

export const fetchLosers = async (time) => {
    try {
      let response = await fetch(`http://localhost:8000/api/losers/?time=${time}`);
      let data = await response.json();
      if (!response.ok) {
        const error = (data && data.detail) ? data.detail : response.status;
        return Promise.reject(error);
      }
      return data.losers;
    } catch(error) {
      return Promise.reject(error);
    }
  };

export const fetchGainers = async (time) => {
    try {
      let response = await fetch(`http://localhost:8000/api/gainers/?time=${time}`);
      let data = await response.json();
      if (!response.ok) {
        const error = (data && data.detail) ? data.detail : response.status;
        return Promise.reject(error);
      }
      return data.gainers;
    } catch(error) {
      return Promise.reject(error);
    }
};

export const register = async (email, password, firstName, lastName, dispatch) => {
      let requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 'email': email, 'password': password, 'first_name': firstName, 'last_name': lastName})
      };
      try {
          let response = await fetch('http://localhost:8000/api/users/register', requestOptions);
          let data = await response.json();
          if (!response.ok) {
              const error = (data && data.detail) ? data.detail : response.status;
              dispatch({
                  type: authConstants.REGISTER_FAILURE,
                  payload: {
                    error: error
                  }
              });
              return Promise.reject(error);
          }
      } catch(error) {
          dispatch({
              type: authConstants.REGISTER_FAILURE,
              payload: {
                error: error
              }
          });
          return Promise.reject(error);
      }
};

export const login = async (email, password, dispatch) => {
  let requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: "username=" + email + "&password=" + password,
      credentials: 'include'
  };
  try {
      let response = await fetch('http://localhost:8000/api/users/login/cookie', requestOptions);
      let data = await response.json();
      if (!response.ok) {
          const error = (data && data.detail) ? data.detail : response.status;
          dispatch({
              type: authConstants.LOGIN_FAILURE,
              payload: {
                error: error
              }
          });
          return Promise.reject(error);
      }
      dispatch({
          type: authConstants.LOGIN_SUCCESS
      });
  } catch(error) {
      dispatch({
          type: authConstants.LOGIN_FAILURE,
          payload: {
            error: error
          }
      });
      return Promise.reject(error);
  }
};

export const logout = async (dispatch) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + Cookies.get('user_auth')
    },
    body: null,
    credentials: 'include'
  };
  try {
    let response = await fetch('http://localhost:8000/api/users/logout/cookie', requestOptions);
    let data = await response.json();
    if (!response.ok) {
      const error = (data && data.detail) ? data.detail : response.status;
      dispatch({
        type: authConstants.LOGOUT_FAILURE,
        payload: {
          error: error
        }
      });
      return Promise.reject(error);
    }
    dispatch({
      type: authConstants.LOGOUT_SUCCESS
    });
  } catch(error) {
    dispatch({
      type: authConstants.LOGOUT_FAILURE,
      payload: {
        error: error
      }
    });
    return Promise.reject(error);
  }
};

export const updateUser = async (updatedUser, dispatch) => {
    const requestOptions = {
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer ' + Cookies.get('user_auth')
      },
      body: JSON.stringify(updatedUser),
      credentials: 'include'
    };
    try {
      let response = await fetch('http://localhost:8000/api/users/me', requestOptions);
      let data = await response.json();
      if (!response.ok) {
        const error = (data && data.detail) ? data.detail : response.status;
          dispatch({
            type: authConstants.UPDATE_USER_FAILURE,
            payload: {
              error: error
            }
          });
        return Promise.reject(error);
      }
        dispatch({
          type: authConstants.UPDATE_USER_SUCCESS,
          payload: {
            user: updatedUser
          }
        });
    } catch(error) {
        dispatch({
          type: authConstants.UPDATE_USER_FAILURE,
          payload: {
            error: error
          }
        });
      return Promise.reject(error);
    }
}

export const getCurrUser = async (dispatch) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + Cookies.get('user_auth')
      },
      body: null
    };
    try {
      let response = await fetch('http://localhost:8000/api/users/me', requestOptions);
      let data = await response.json();
      if (!response.ok) {
        const error = (data && data.detail) ? data.detail : response.status;
        dispatch({
          type: authConstants.GET_USER_FAILURE
        });
        return Promise.reject(error);
      }
      dispatch({
        type: authConstants.GET_USER_SUCCESS,
        payload: {
          user: data
        }
      });
    } catch(error) {
      dispatch({
        type: authConstants.GET_USER_FAILURE
      });
      return Promise.reject(error);
    }
};