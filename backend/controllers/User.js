import { User, Book } from "../models/libModel.js"
import { validationResult } from 'express-validator'
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
dotenv.config()


export const createUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errorArr = errors.array();
            const errorMessages = [];

            errorArr.forEach(errorObj => {
                const { path } = errorObj;
                if (path === "username") {
                    errorMessages.push("Please provide a string value for username.");
                }
                if (path === "password") {
                    errorMessages.push("Please provide a strong password.");
                }
            });

            res.status(400).json({ messages: errorMessages });
        } else {
            let { username, password } = req.body;
            let search = await User.findOne({ username });
            if (!search) {
                let createUser = await new User({ username, password });
                createUser.save();
                res.json({ message: "User created successfully." });
            } else {
                res.status(400).json({ message: "Username is already taken. Please choose a different username." });
            }
        }
    } catch (err) {
        res.status(500).json({ message: "The backend server couldn't work. Please try again later." });
    }
};

export const login = async (req, res) => {
    try {
        let error = validationResult(req)
        if (!error.isEmpty()) {
            let errorArr = error.array();
            const errorMessages = [];

            errorArr.forEach(errorObj => {
                const { path } = errorObj;
                if (path === "username") {
                    errorMessages.push("Please provide a string value for username.");
                }
                if (path === "password") {
                    errorMessages.push("Please provide a string value for the password");
                }
            });
            res.status(400).json({ messages: errorMessages });
        } else {
            let { username, password } = req.body
            let check = await User.findOne({ username, password })
            if (check) {
                let assignJWT = jwt.sign({ username, profile: 'user' }, process.env.SECRET_CODE)
                res.json({ token: assignJWT })
            } else {
                res.json({ message: "Please provide the correct credentials" })
            }
        }
    } catch (err) {
        res.status(500).json({ message: "The backend server couldn't work. Please try again later." });
    }

}

export const createBooks = async (req, res) => {
    try {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            let errorArr = error.array();
            const errorMessages = [];

            errorArr.forEach(errorObj => {
                const { path } = errorObj;
                if (path === "title") {
                    errorMessages.push("Please enter the string value to the length of min 4");
                }
                if (path === "author") {
                    errorMessages.push("Please provide a string value for the author");
                }
                if (path === "summary") {
                    errorMessages.push("Please provide a string value for the summary");
                }
            });
            res.status(400).json({ messages: errorMessages });
        } else {
            let { title, author, summary } = req.body
            let createBook = await new Book({ title, author, summary })
            createBook.save()
            res.json({ message: "You have published a book", id: createBook._id })
        }
    } catch (err) {
        res.status(403).json({ message: "The Backend Server couldnt work, Please try again later" })
    }
}

export const showAllBooks = async (req, res) => {
    try {
        let fetchAllBook = await Book.find({}).select("-_id title author summary")
        res.json(fetchAllBook)
    } catch (err) {
        res.json(err)
    }
}

export const showSingleBook = async (req, res) => {
    let error = validationResult(req)
    if (!error.isEmpty()) {
        let errorArr = error.array();
        const errorMessages = [];

        errorArr.forEach(errorObj => {
            const { path } = errorObj;
            if (path === "id") {
                errorMessages.push("Please enter the correct id");
            }
        });
        res.status(400).json({ messages: errorMessages });
    } else {
        let { id } = req.params
        let searchBook = await Book.findOne({ _id: id }).select("-_id title author summary")
        res.json(searchBook)
    }
}
export const updateBook = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((errorObj) => {
            const { path } = errorObj;
            return `Invalid value for ${path}`;
        });
        return res.status(400).json({ errors: errorMessages });
    }
    const { id } = req.params;
    try {
        const updatedBook = await Book.findOneAndUpdate({ _id: id }, req.body, { new: true });
        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }
        return res.json({ message: "You have successful edited it" });
    } catch (err) {
        return res.status(500).json({
            message: "The Backend Server couldnt work, Please try again later"
        });
    }
};


export const deleteBook = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((errorObj) => {
            const { path } = errorObj;
            return `Invalid value for ${path}`;
        });
        return res.status(400).json({ errors: errorMessages });
    }
    let { id } = req.params
    try {
        let deleteBook = await Book.findOneAndDelete({ _id: id })
        if (deleteBook) {
            res.json({ message: "Successfully Deleted the Book" })
        } else {
            res.json({ message: "Please provide the correct id" })
        }
    } catch (err) {
        res.status(500).json({ message: "The Backend Server couldnt work, Please try again later" })
    }

}