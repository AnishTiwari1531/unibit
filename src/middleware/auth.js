const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const verifyToken = function (req, res, next) {
  try {

    const authHeader = req.headers.token || req.headers["authorization"];

    if (authHeader) {

      const token = authHeader.split(" ")[1];

      const decoded = jwt.decode(token);

      if (!decoded) {
        return res.status(401).send({
          Status: 'Failed',
          Message: "Invalid authentication token in request headers ",
        });
      }

      if (Date.now() > decoded.exp * 1000) {
        return res.status(401).send({
          Status: 'Failed',
          Message: "Session expired! Please login again ",
        });
      }

      jwt.verify(token, "broaddcast", (err, user) => {

        if (err)

          return res.status(401).send({ Status: false, Message: "Token is not valid!" });

        req.user = user;

        next();
      });
    } else {

      return res.status(401).send({ Status: false, Message: "You are not authenticated!" });

    }
  } catch (error) {
    res.status(500).send({ Status: 'Failed', Message: error.message });
  }

};


const verifyTokenAndAuthorization = async (req, res, next) => {
  try {
    verifyToken(req, res, () => {
      if (req.user.userId === req.params.userId || req.user.role) {

        next();

      } else {

        return res.status(403).send({ Status: false, message: "You are not authorized!" });
      }

    });
  } catch (error) {
    res.status(500).send({ Status: 'Failed', Message: error.message });
  }
};

const verifyTokenAndAdmin = (req, res, next) => {
  try {
    verifyToken(req, res, async () => {
      let ad = await userModel.findById(req.user.userId)
      console.log(ad)
      if (ad.role) {

        next();

      } else {
        console.log(req.user)
        return res.status(403).send("You are not alowed to do that!");
      }

    });
  } catch (error) {
    res.status(500).send({ Status: 'Failed', Message: error.message });
  }
};

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };