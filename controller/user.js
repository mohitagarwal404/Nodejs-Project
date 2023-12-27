const {
  decodeJwtToken,
  getErrorResponse,
  getSuccessResponse,
} = require("../helper/commonFunction");

const { getDocuments, updateDocument } = require("../model/mongo");

const config = require("../config/config");
const profileKeys = config["profileKeys"];

const getProfile = async (req, res) => {
  try {
    const token = req.headers.token;
    const tokenDetail = decodeJwtToken(token);
    const username = tokenDetail.username;
    const userDetail = await getDocuments("users", (filter = { username }));
    delete userDetail[0]["password"];
    if (userDetail.length) {
      return getSuccessResponse(res, 200, 2002, "Success", userDetail[0]);
    } else {
      return getErrorResponse(res, 401, 4011, "Unauth!");
    }
  } catch (error) {
    console.log("Error while fetching profile", error);
    return getErrorResponse(res, 500, 5001, "Internal Error!");
  }
};

const updateProfile = async (req, res) => {
  try {
    const token = req.headers.token;
    const tokenDetail = decodeJwtToken(token);
    const username = tokenDetail.username;

    const updateData = req.body;

    if ("username" in updateData || "password" in updateData) {
      return getErrorResponse(
        res,
        400,
        4005,
        "Cannot update 'username' or 'password'!"
      );
    }

    const unknownKeys = Object.keys(updateData).filter(
      (key) => !profileKeys.includes(key)
    );
    if (unknownKeys.length > 0) {
      return getErrorResponse(
        res,
        401,
        4006,
        `Unknown keys: ${unknownKeys.join(", ")}.`
      );
    }

    const validUpdateKeys = Object.keys(updateData).filter((key) =>
      profileKeys.includes(key)
    );

    const updateObj = {};
    validUpdateKeys.forEach((key) => {
      updateObj[key] = updateData[key];
    });

    const result = await updateDocument("users", { username }, { updateObj });

    if (result.modifiedCount > 0) {
      return getSuccessResponse(res, 200, 2003, "Profile updated successfully");
    } else {
      return getErrorResponse(res, 401, 4007, "No updates applied");
    }
  } catch (error) {
    console.error("Error while updating profile:", error);
    return getErrorResponse(res, 500, 5001, "Internal Error");
  }
};

module.exports = { getProfile, updateProfile };
