import express from "express";
import { Client } from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

const con = new Client({
    host: "localhost",
    user: "postgres",
    password: "v155179m20",
    database: "postgres",
    port: 5432
});

con.connect()
    .then(() => console.log("Postgres is connected!!!"))
    .catch(err => console.error(err));

router.post('/register', async(req, res) => {
    const { name, surname, phonenumber, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 15);

    const insertquery =
            "INSERT INTO users (name, surname, phonenumber, email, password) VALUES ($1,$2,$3,$4,$5)";

    const verifyquery = "SELECT * FROM users WHERE email = $1";

    try {
        const result = await con.query(verifyquery, [email]);

        if(result.rows.length > 0) {
            return res.json({ status: false, message: "User with this email already exists!" });
        } else {
            await con.query(insertquery,[name, surname, phonenumber, email, hashedPassword ]);
            return res.json({ status: true })
        }

    } catch (err) {
        console.error(err);
    }

});

router.get('/login', async(req, res) => {
    const { email, password } = req.query;

    const isuserquery = "SELECT * FROM users WHERE email = $1";

    try {
        const result = await con.query(isuserquery, [email]);

        if(result.rows.length > 0) {

            const isPasswordValid = await bcrypt.compare(password, result.rows[0].password);

            if(isPasswordValid) {

                const token = await jwt.sign(
                    { email: result.rows[0].email },
                            process.env.JWT_SECRET_KEY,
                    { expiresIn: "7d" }
                )

                return res.json({ status: true, token });
            } else {
                return res.json({ status: false, message: "Please write correct password!!!"})
            }

        } else {
            return res.json({ status: false, message: "User with this email not found!!!"})
        }

    } catch(err) {
        console.error(err)
    }

});

router.get('/verifyprofile', async(req, res) => {
    const token = req.query.token;

    const decoded = await jwt.verify(
        token,
        process.env.JWT_SECRET_KEY
    );

    const getprofilequery =
                        "SELECT * FROM users WHERE email = $1";

    const result = await con.query(getprofilequery, [decoded.email]);

    if(result.rows.length > 0) {
        return res.json({ status: true, user: result.rows[0] });
    } else {
        return res.json({ status: false });
    }
});

export default router;