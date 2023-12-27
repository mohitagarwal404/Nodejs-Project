module.exports = {
  connection: {
    mongo: {
      password: "password",
      username: "username",
      dbName: "mog_db",
    },
  },
  auth: {
    secretKey: "your secret key",
  },
  profileKeys: ["name", "email", "mobile"],
};
