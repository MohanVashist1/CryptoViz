import * as authConstants from "./constants/auth";

export const reducer = (state, action) => {
    switch (action.type) {
      case authConstants.UPDATE_USER_FAILURE:
      case authConstants.LOGOUT_FAILURE:
      case authConstants.LOGIN_FAILURE:
      case authConstants.REGISTER_FAILURE:
        return {
          ...state,
          error: action.payload.error,
        };
      case authConstants.GET_USER_SUCCESS:
        return {
          ...state,
          isAuthenticated: true,
          user: action.payload.user,
        };
      case authConstants.UPDATE_USER_SUCCESS:
        return {
          ...state,
          isAuthenticated: true,
          user: action.payload.user,
          error: "",
        };
      case authConstants.ERROR_CLOSE:
      case authConstants.REGISTER_SUCCESS:
      case authConstants.LOGIN_SUCCESS:
        return {
          ...state,
          error: "",
        };
      case authConstants.LOGOUT_SUCCESS:
        return {
          ...state,
          isAuthenticated: false,
          user: {},
          error: "",
        };
      case authConstants.GET_USER_FAILURE:
        return {
          ...state,
          isAuthenticated: false,
          user: {},
        };
      default:
        return state;
    }
};