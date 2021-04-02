import {
  SUCCESS,
  FAILED,
  USER_AUTH,
  REMOVE_ERRORS,
  EDITSUCCESS,
  COMPLETE,
  LOGOUT,
} from "../actions/actionTypes";

const token = localStorage.getItem("token");

export const InitialState = {
  success: false,
  successMessage: "",
  errorMessage: "",
  isCompletinfo: false,
  token: token,
  username: "",
  id: "",
  errors: {
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmpassword: "",
  },
};

export const UserReducer = (state = InitialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SUCCESS:
      return {
        ...state,
        success: payload.success,
        successMessage: payload.successMessage,
        token: payload.token,

        username: payload.username,
      };
    case USER_AUTH:
      return {
        ...state,
        user: {
          id: payload.id,
        },
      };
    case EDITSUCCESS:
      return {
        ...state,
        success: payload.success,
        successMessage: payload.successMessage,
      };
    case COMPLETE:
      return {
        ...state,
        success: payload.success,
        isCompletinfo: payload.isCompletinfo,
        username: payload.username,
        id: payload.id,
      };
    case FAILED:
      return { ...state, errorMessage: payload.error, success: false };
    case REMOVE_ERRORS:
      return { ...state, errorMessage: "" };
    case LOGOUT:
      return {
        ...state,
        token: "",
        isCompletinfo: false,
        username: "",
        id: "",
        successMessage: "",
      };
    default:
      throw new Error();
  }
};
