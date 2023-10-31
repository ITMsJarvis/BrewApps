import express from 'express'
let router = express.Router()
import { login, createUser, createBooks, showAllBooks, showSingleBook, updateBook, deleteBook } from "../controllers/User.js"
import { authenticateJwt } from '../middleware/auth.js'
import { body, param } from 'express-validator'

//CREATE
router.post("/create-user", [body("password").isStrongPassword(), body("username").isString()], createUser)
router.post("/login", [body("username").isString(), body("password").isString()], login)
router.post("/create-book", [body("title").isString(), body("author").isString(), body("summary").isString()], authenticateJwt, createBooks)

//READ
router.get("/show-book", authenticateJwt, showAllBooks)
router.get("/book/:id", param("id").isMongoId(), authenticateJwt, showSingleBook)

//UPDATE
router.put("/update-book/:id", [param("id").isMongoId(), body("title").isString().optional(), body("author").isString().optional() || body("summary").isString().optional()], authenticateJwt, updateBook)

//DELETE
router.delete("/delete-book/:id", param("id").isMongoId(), authenticateJwt, deleteBook)


export default router;