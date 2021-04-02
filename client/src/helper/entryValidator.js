// import { ERROR_ON_FIELDS } from "../actions/actionTypes";
// import {
//   validatefirstname,
//   validatelastname,
//   validateUsername,
//   validateEmail,
//   validatePassword,
// } from "./user.validator";
// const errors = {
//   username: "",
//   firstname: "",
//   lastname: "",
//   email: "",
//   password: "",
//   confirmpassword: "",
// };

// function checkProperties(obj) {
//   for (var key in obj) {
//     if (obj[key] !== null && obj[key] !== "") return false;
//   }
//   return true;
// }

// const entryValidator = (registerdata, dispatch) => {
//   let error;

//   // validate register data
//   if ((error = validatefirstname(registerdata.firstname))) {
//     errors.firstname = error.message;
//   }
//   if ((error = validatelastname(registerdata.lastname))) {
//     errors.lastname = error.message;
//   }
//   if ((error = validateUsername(registerdata.username))) {
//     errors.username = error.message;
//   }
//   if ((error = validateEmail(registerdata.email))) {
//     errors.email = error.message;
//   }
//   if ((error = validatePassword(registerdata.password))) {
//     errors.password = error.message;
//   }
//   if (registerdata.password !== registerdata.confirmpassword) {
//     errors.confirmpassword = "Passwords doesn't match !";
//   }
//   return errors.firstname !== "" ||
//     errors.lastname !== "" ||
//     errors.username !== "" ||
//     errors.email !== "" ||
//     errors.password !== "" ||
//     errors.confirmpassword !== ""
//     ? errors
//     : null;
//   // if (!checkProperties(errors)) {
//   //   dispatch({
//   //     type: ERROR_ON_FIELDS,
//   //     payload: {
//   //       errors: errors,
//   //     },
//   //   });
//   // }
// };

// export default entryValidator;
