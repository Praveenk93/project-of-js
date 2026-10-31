import { Router } from "express";
import {
    login,
    logoutUser,
    registerUser,
    verifyEmail,
} from "../controllers/auth.controllers.js";
import { verifyjwt } from "../middlewares/auth-middlewere.js";
import { validate } from "../middlewares/validator-middleware.js";
import {
    userLoginValidator,
    userRegisterValidator,
} from "../validators/index.js";

const router = Router();

router.post("/register", userRegisterValidator(), validate, registerUser);
router.post("/login", userLoginValidator(), validate, login);
router.get("/verify-email/:token", verifyEmail);
router.post("/logout", verifyjwt, logoutUser);

export default router;
