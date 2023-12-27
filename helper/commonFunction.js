const jwt = require("jsonwebtoken");
const config = require("../config/config");
const secretKey = config["auth"]["secretKey"];
const errorMessage = config.errorMessage;
const successMessage = config.successMessage;

function generateJwtToken(payload) {
  try {
    const token = jwt.sign(payload, secretKey);
    return token;
  } catch (error) {
    console.error("Error generating JWT token:", error);
    throw error;
  }
}

function decodeJwtToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    throw error;
  }
}

const getErrorResponse = (res, status, subStatus, msg = null) => {
  status = status.toString();
  subStatus = subStatus.toString();

  const result = {
    success: false,
    code: subStatus,
    data: null,
    msg: msg || errorMessage?.[status]?.[subStatus],
  };

  const responseStatus = parseInt(status);
  return res.status(responseStatus).json(result);
};

const getSuccessResponse = (
  res,
  status,
  subStatus,
  data = null,
  msg = null
) => {
  status = status.toString();
  subStatus = subStatus.toString();

  const result = {
    success: true,
    code: subStatus,
    data,
    msg: msg || successMessage?.[status]?.[subStatus],
  };

  const responseStatus = parseInt(status);

  return res.status(responseStatus).json(result);
};

module.exports = {
  generateJwtToken,
  decodeJwtToken,
  getErrorResponse,
  getSuccessResponse,
};
