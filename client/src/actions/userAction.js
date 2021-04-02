import axios from "axios";
import { SUCCESS, FAILED, COMPLETE, USER_AUTH, LOGOUT } from "./actionTypes";
import { socketConn as socket } from "../sockets";

// ? Register Action
export const registerAction = async (registerData) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.post(
      "http://localhost:3001/api/users/register",
      registerData,
      config
    );

    if (res) return res.data;
    return false;
  } catch (error) {
    return error.response.data;
  }
};

// ?Login Action
export const loginAction = async (loginData, dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.post(
      "http://localhost:3001/api/users/login",
      loginData,
      config
    );
    localStorage.setItem("token", res.data.token);
    socket.emit("login", res.data.token);

    dispatch({
      type: SUCCESS,
      payload: {
        success: res.data?.success,
        successMessage: res.data?.message,
        token: res.data?.token,
        isCompletinfo: res.data?.isInfosComplete,
        username: loginData.username,
      },
    });

    if(res.data) return res?.data
 
  } catch (error) {

    return error.response?.data;
  }
};

// *LOGOUT Action
export const logoutAction = async (id, dispatch) => {
  localStorage.removeItem("token");
  socket.emit("logout", { userid: id });
  dispatch({
    type: LOGOUT,
    payload: {},
  });
};

// ?Load user
export const setAuthUserData = async (data, dispatch) => {
  try {
    dispatch({
      type: USER_AUTH,
      payload: {
        id: data.id,
        username: data.username,
      },
    });
  } catch (error) { }
};

// ? RESET ACTION
export const resetAction = async (resetData) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.post(
      "http://localhost:3001/api/users/resetpassword",
      resetData,
      config
    );

    if (res) return res.data;
  } catch (error) {
    return error.response?.data;
  }
};

// ? changePasswordAction
export const changePasswordAction = async (newPassData, itoken) => {
  const data = {
    newpassword: newPassData.password,
    confirmpassword: newPassData.password,
    token: itoken,
  };
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.patch(
      "http://localhost:3001/api/users/newpassword",
      data,
      config
    );

    if (res) return res.data;
  } catch (error) {
    return error.response.data;
  }
};

// ? get user action

export const getUserAction = async (token, dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await axios.get(
      "http://localhost:3001/api/users/verify/isinfoscompleted",
      config
    );

    dispatch({
      type: COMPLETE,
      payload: {
        success: res.data.success,
        isCompletinfo: res.data.complete,
        username: res.data.username,
        id: res.data.userid,
      },
    });
    return true;
  } catch (error) {
    dispatch({
      type: FAILED,
      payload: {
        success: error.response?.data.success,
        error: error.response?.data.error,
      },
    });
    return false;
  }
};

// ? Steps Action
export const stepsAction = async (token, userData, dispatch) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };

  let CompletedData = Object.assign({}, userData);

  let date = new Date(CompletedData.birthday._d);
  const y = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  const m = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(date);
  const d = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
  const BD = y + "-" + m + "-" + d;

  CompletedData.tags = CompletedData.tags.map((item) => {
    return item.substring(1);
  });
  let form = new FormData();
  form.set("gender", CompletedData.gender);
  form.set("looking", CompletedData.interest);
  form.set("bio", CompletedData.bio);
  form.set("tags", CompletedData.tags);
  form.set("birthday", BD);
  form.set("lat", CompletedData.lat);
  form.set("lang", CompletedData.lang);
  form.set("country", CompletedData.country);
  form.set("city", CompletedData.city);

  if (CompletedData.profile.length)
    form.append("profile", CompletedData.profile[0]);
  CompletedData.gallery.forEach((element) => {
    form.append("gallery", element);
  });

  try {
    const res = await axios.patch(
      "http://localhost:3001/api/users/completeinfos",
      form,
      config
    );

    if (res) return res.data;
  } catch (error) {
    return error.response?.data;
  }
};

//* CHECK TOKEN IS VALID

export const checkTokenAction = async (token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.post(
      "http://localhost:3001/api/users/verify/token",
      { token: token },
      config
    );

    if (res.data?.valide) return res.data?.valide;
    else {
      localStorage.removeItem("token");
      return false;
    }
  } catch (error) {
    localStorage.removeItem("token");
    return false;
  }
};
