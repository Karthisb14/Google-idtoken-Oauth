const cookieParser = require('cookie-parser')
const express = require('express')
const auth = require('./Middleware/auth')

// Google auth
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '213634042003-uokiipl8lic0kbjc9svegt27dbjfe9qm.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

const app = express()
const port = process.env.PORT || 5000

// Middleware
app.set('view engine', 'ejs')
app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', async (req, res) => {


    try {

        let token = req.body.token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        // console.log(payload)
        const userid = payload['sub'];

        res.cookie('session-token', token);
        res.send('success')
    } catch (e) {
        res.send(e)
    }
})

app.get('/dashboard', auth, (req, res) => {
    let user = req.user;
    res.render('dashboard', { user });
})


app.get('/protectedRoute', auth, (req, res) => {
    res.send('This route is protected')
})

app.get('/logout', (req, res) => {
    res.clearCookie('session-token');
    res.redirect('/login')
})


app.listen(port, () => {
    console.log(`Server is Running on port ${port}`);
})




