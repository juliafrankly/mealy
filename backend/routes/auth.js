const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

function createToken(user) {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

router.post("/register", async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ message: "Email, username and password are required." });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: "Please enter a valid email address." });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO users (email, username, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, username`,
            [email.toLowerCase(), username, passwordHash]
        );
        const user = result.rows[0];
        res.status(201).json({ token: createToken(user), user });
    } catch (err) {
        if (err.code === "23505") {
            return res.status(409).json({ message: "Email or username is already taken." });
        }
        console.error(err);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [
            email.toLowerCase(),
        ]);
        const user = result.rows[0];
        const valid = user && (await bcrypt.compare(password, user.password_hash));

        if (!valid) {
            return res.status(401).json({ message: "Incorrect email or password." });
        }

        res.json({
            token: createToken(user),
            user: { id: user.id, email: user.email, username: user.username },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
});

module.exports = router;