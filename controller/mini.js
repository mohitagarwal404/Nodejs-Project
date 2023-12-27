const getWeb = async (req, res) => {
  try {
    const webname = req.body.webname;

    if (!webname) {
      return getErrorResponse(res, 401, 4009, "Key not found!");
    }

    const webDetail = await getDocuments("mini_webs", (filter = { webname }));
    if (!webDetail.length) {
      return getErrorResponse(
        res,
        401,
        4008,
        "Web not available for this webname!"
      );
    }

    return getSuccessResponse(res, 200, 2002, "Success", webDetail[0]);
  } catch (error) {
    console.log("Error while fetching mini");
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllWeb = async (req, res) => {
  try {
    const token = req.headers.token;
    const tokenDetail = decodeJwtToken(token);
    const username = tokenDetail.username;

    const userDetail = await getDocuments("users", (filter = { username }));

    if (!userDetail.length) {
      return getErrorResponse(res, 401, 4011, "Unauth!");
    }

    if (userDetail[0]["all_webs"]) {
      return getSuccessResponse(
        res,
        200,
        2002,
        "Success",
        userDetail[0]["all_webs"]
      );
    } else {
      return getErrorResponse(res, 400, 4008, "No webs available!");
    }
  } catch (error) {
    console.log("Error while fetching mini");
    return getErrorResponse(res, 500, 5001, "Internal Error!");
  }
};

const createWeb = async (req, res) => {
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
