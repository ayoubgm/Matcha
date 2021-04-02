import { message } from "antd";

export const openMessageSuccess = (msg) => {
  setTimeout(() => {
    message.success(msg, 3);
  }, 3000);
};

export const openMessageError = (msg) => {
  setTimeout(() => {
    message.error(msg, 3);
  }, 3000);
};
export const openMessageInfo = () => {
  message.success("See You Soon", 3);
};
export const openMessageWarning = (msg) => {
  setTimeout(() => {
    message.warning(msg, 2);
  }, 3000);
};

export const isLogin = () => {
  return localStorage.getItem("token") ? true : false;
};

export const isCompletinfos = (state) => {
  return state.isCompletinfo;
};
