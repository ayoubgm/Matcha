// export const validatefirstname = (firstname) => {
//   return !/^[a-z]{3,}$/.test(firstname)
//     ? new Error(
//         "The firstname must be contains letters only at least 3 letters !"
//       )
//     : firstname.length > 30
//     ? new Error("The firstname is too long !")
//     : null;
// };

// export const validatelastname = (lastname) => {
//   return !/^[a-z]{3,}$/.test(lastname)
//     ? new Error(
//         "The lastname must be contains letters only at least 3 letters !"
//       )
//     : lastname.length > 30
//     ? new Error("The lastname is too long !")
//     : null;
// };

// export const validateEmail = (email) => {
//   return !/[a-zA-Z0-9-_.]{1,50}@[a-zA-Z0-9-_.]{1,50}\.[a-z0-9]{2,10}$/.test(
//     email
//   )
//     ? new Error("Invalid email address !")
//     : null;
// };

// export const validateUsername = (username) => {
//   return !/^[a-zA-Z]+(([-_.]?[a-zA-Z0-9])?)+$/.test(username)
//     ? new Error(
//         "The username must be contains letters or numbers ( -, _ or . ) !"
//       )
//     : username.length < 3 || username.length > 20
//     ? new Error("The username should be between 3 and 20 characters !")
//     : null;
// };

// export const validatePassword = (password) => {
//   return !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*_-]).{8,}$/.test(
//     password
//   )
//     ? new Error(
//         "The password should be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character !"
//       )
//     : null;
// };
