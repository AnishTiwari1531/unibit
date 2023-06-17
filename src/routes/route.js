const express = require('express');
const router = express.Router();
const { verifyTokenAndAuthorization } = require("../middleware/auth");
const { createUser, login, updateUser, deleteUser } = require("../controller/userController");
const { createTicket } = require("../controller/tambulaController");


//User Controller
router.post("/createuser", createUser);
router.post("/login", login);
router.put("/updateUser/:userId", verifyTokenAndAuthorization, updateUser);
router.delete("/deleteUser/:userId", verifyTokenAndAuthorization, deleteUser);

//Tambula Controller
router.post("/createticket", createTicket);
// router.get("/getticket", fetchTickets);

//if api is invalid OR wrong URL
router.all("**", (req, res) => {
    res.status(404).send({ 
        Status: "HELLO! SOrry TO SEE YOU HERE. ", 
        Message: "THE API YOU REQUESTED IS NOT AVAILABLE" })
}
);

//If user try to search home page [ without any specfic route]
router.all("/", (req, res) => {
    return res.status(200).send({
        Status: "HELLO! NICE TO SEE YOU HERE. ",
        Message: " TRY SPECIFIC ROUTES TO SIGN UP, SIGN IN, CREATE-READ-UPDATE-DELETE OR FETCH ALL USER DETAILS"
    });
})

module.exports = router