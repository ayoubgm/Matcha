const { OAuth2Client } = require("google-auth-library");
const OAuth2 = new OAuth2Client(process.env.CLIENT_ID);
const Image = require("../models/image.model");
const Tag = require("../models/tag.model");
const findUserTags = require("../models/tag.model");

exports.filterbody = async (body) =>
  new Promise((resolve, reject) => {
    try {
      const user = Object.assign({}, body);

      for (let field in user)
        user[field] = field.includes("password")
          ? user[field]
          : user[field].toString().trim().toLowerCase();
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });

exports.getPayloadGoogleAccount = async (tokenid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const ticket = await OAuth2.verifyIdToken({
        idToken: tokenid,
        audience: process.env.CLIENT_ID,
      });
      resolve(ticket.getPayload());
    } catch (e) {
      reject(e);
    }
  });
};

exports.getAge = (DOB) => {
  const today = new Date();
  const birthday = new Date(DOB);
  const month = today.getMonth() - birthday.getMonth();
  let age = today.getFullYear() - birthday.getFullYear();

  if (month < 0 || (month == 0 && today.getDate() < birthday.getDate())) age--;
  return age;
};

exports.prepareUserData = async (users) => {
  let arrayUsers = JSON.parse(users);

  return Promise.all(
    arrayUsers.map(async (item) => {
      let o = Object.assign({}, item);
      o.tags = JSON.parse(await Tag.findUserTags(item.id));
      return o;
    })
  );
};

exports.msgsMulterError = (code) => {
  return code == "LIMIT_FILE_SIZE"
    ? new Error("The file must be less than 2MB !")
    : code == "LIMIT_UNEXPECTED_FILE"
    ? new Error("Unexpected fields to get files from !")
    : new Error("An error has occurend while validate uploaded files !");
};

exports.getRangeDistance = (mind, maxd) => {
  return {
    min: mind >= 0 && mind <= 1000 ? parseInt(mind) : 0,
    max: maxd >= 0 && maxd <= 1000 ? parseInt(maxd) : 1000,
  };
};

exports.getRangeAge = (mina, maxa) => {
  return {
    min: mina >= 18 && mina <= 60 ? parseInt(mina) : 18,
    max: maxa >= 18 && maxa <= 60 ? parseInt(maxa) : 60,
  };
};

exports.getRangeFame = (minf, maxf) => {
  return {
    min: minf >= 0 && minf <= 100 ? parseInt(minf) : 0,
    max: maxf >= 0 && maxf <= 100 ? parseInt(maxf) : 100,
  };
};
