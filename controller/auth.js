const { insertDocument, getDocuments } = require("../model/mongo");
const {
  generateJwtToken,
  getErrorResponse,
  getSuccessResponse,
} = require("../helper/commonFunction");

async function signup(req, res) {
  try {
    if (!req.body?.username) {
      return getErrorResponse(res, 400, 4001, "Enter Username!");
    }

    if (!req.body?.password) {
      return getErrorResponse(res, 400, 4002, "Enter Password!");
    }

    if (!req.body?.name) {
      return getErrorResponse(res, 400, 4003, "Enter Name!");
    }

    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;

    const userAlrdExst = await getDocuments("users", (filter = { username }));

    if (userAlrdExst.length) {
      return getErrorResponse(res, 400, 4004, "Username already exists!");
    }

    const newUser = { username, password, name };
    const insertedUser = await insertDocument("users", newUser);
    if (insertedUser) {
      return getSuccessResponse(res, 200, 2001, "Signup Successfully");
    }
  } catch (error) {
    return getErrorResponse(res, 500, 5001, "Internal Error!");
  }
}

async function login(req, res) {
  try {
    if (!req.body?.username) {
      console.log("SIGNUP ERROR: Enter Username");
      return getErrorResponse(res, 400, 4001, "Enter Username!");
    }

    if (!req.body?.password) {
      console.log("SIGNUP ERROR: Enter Password");
      return getErrorResponse(res, 400, 4002, "Enter Password!");
    }

    const username = req.body.username;
    const password = req.body.password;

    const userLogin = await getDocuments(
      "users",
      (filter = { username, password })
    );

    if (userLogin.length) {
      userLogin[0]["_id"] = userLogin[0]._id.toString();
      delete userLogin[0]["password"];
      delete userLogin[0]["name"];
      const loginToken = generateJwtToken(userLogin[0]);
      return getSuccessResponse(
        res,
        200,
        2001,
        loginToken,
        "Login Successfully"
      );
    } else {
      return getErrorResponse(res, 400, 4002, "Incorrect Details!");
    }
  } catch (error) {
    console.error("Error while Login:", error);
    return getErrorResponse(res, 500, 5001, "Internal Error!");
  }
}

module.exports = { signup, login };
