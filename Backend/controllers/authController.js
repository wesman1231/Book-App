const { TransactionalEmailsApi, SendSmtpEmail, CreateContact, ContactsApi } = require('@getbrevo/brevo');
const db = require('../config/db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
let emailAPI = new TransactionalEmailsApi();
emailAPI.authentications.apiKey.apiKey = process.env.BREVO_API_KEY;
let contactAPI = new ContactsApi();
contactAPI.authentications.apiKey.apiKey = process.env.BREVO_API_KEY;

exports.signup = async (req, res) => {
    const { email, username, password } = req.body;
    try {
        if (!email || !username || !password) {
            return res.status(400).json({ message: "Email, username, and password are required" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        await db.execute('INSERT INTO logininfo (email, username, hashedPassword, verification_token) VALUES (?, ?, ?, ?)', [email, username, hashedPassword, verificationToken]);
        await contactAPI.createContact({email});
        const verifyUrl = `https://book-app-production-343e.up.railway.app/verifyEmail/?token=${verificationToken}`;
        let message = new SendSmtpEmail();
        message.subject = "Verify Your Account"; 
        message.sender = {name: "Your Reading Corner", email: "verify.account@yourreadingcorner.com"};
        message.to = [{email: email}];
        message.htmlContent = 
        `<html>
            <body>
                <h2>Hello, welcome to Your Reading Corner!</h2>
                <p>Please click <a href="${verifyUrl}">here</a> to verify your email address.</p>
            </body>
        </html>`
        ;
        await emailAPI.sendTransacEmail(message);
        res.status(200).json({ message: 'Signup successful' });
    } catch (error) {
        console.error('Signup error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            const msg = error.message.includes('email') ? 'Email already exists' : 'Username already exists';
            res.status(400).json({ message: msg });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    
};

exports.verifyEmail = async (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).send("Invalid verification link.");
    }

    try {
        const [rows] = await db.execute('SELECT * FROM logininfo WHERE verification_token = ?', [token]);
        console.log('User found:', rows);

        if (rows.length === 0) {
            return res.status(400).send("Invalid or expired token.");
        }

        await db.execute('UPDATE logininfo SET is_verified = ?, verification_token = NULL WHERE verification_token = ?', [true, token]);

        res.send("Email verified successfully! You can now log in.");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error.");
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password required.' });
        }

        const [rows] = await db.execute('SELECT hashedPassword, is_verified FROM logininfo WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const { hashedPassword, is_verified } = rows[0];
        const validPassword = await bcrypt.compare(password, hashedPassword);

        if (!validPassword) {
            return res.status(400).json({message: 'Invalid credentials'});
        }
        else if (validPassword && !is_verified) {
            return res.status(400).json({ message: 'Please verify your email address before logging in.' });
        }

        req.session.user = { username };
        res.status(200).json({message: 'Login successful'});
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({message: 'Internal server error'});
    }
};

exports.changePasswordRequest = async (req, res) => {
    const {email} = req.body;
    try{
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        
        const [rows] = await db.execute('SELECT email FROM logininfo WHERE email = ? AND is_verified = ?', [email, true]);
        if(rows.length === 0){
           return res.status(404).json({message: 'Could not find an account associated with that email'});
        }
        else if(rows.length === 1){
            const passwordResetToken = crypto.randomBytes(32).toString('hex');
            const verifyUrl = `https://book-app-production-343e.up.railway.app/changePassword?token=${passwordResetToken}`;
            await db.execute('UPDATE logininfo SET reset_token = ?, reset_token_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE email = ?', [passwordResetToken, email]);
            let message = new SendSmtpEmail();
            message.subject = "Change Password"; 
            message.sender = {name: "Your Reading Corner", email: "verify.account@yourreadingcorner.com"};
            message.to = [{email: email}];
            message.htmlContent = 
            `<html>
                <body>
                    <h2>Change Password</h2>
                    <p>Please click <a href="${verifyUrl}">here</a> to change your password.</p>
                </body>
            </html>`
        ;
            await emailAPI.sendTransacEmail(message);
            return res.status(200).json({message: 'Password change request sent to email'});
        }
    } catch(error){
        console.error('Error sending password change email: ', error);
        return res.status(500).json({message:'Internal server error'});
    }
};

exports.changePassword = async (req, res) => {
    const {token} = req.query;
    const {password} = req.body
    if(!token){
        return res.status(400).send("Invalid/expired reset link.");
    }
    try{
        const [rows] = await db.execute('SELECT * FROM logininfo WHERE reset_token = ? AND reset_token_expires > NOW()', [token]);
        if (rows.length === 0) {
            return res.status(400).json({ message: 'Invalid/expired reset link.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute('UPDATE logininfo SET hashedPassword = ?, reset_token = NULL, reset_token_expires = NULL WHERE reset_token = ?', [hashedPassword, token])
        return res.status(200).json({message: 'Password successfully changed'});
    } catch(error){
        console.error('Error changing password: ', error);
        return res.status(500).json({message:'Internal server error'});
    }
};



