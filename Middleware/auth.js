const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '213634042003-uokiipl8lic0kbjc9svegt27dbjfe9qm.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

const auth = async (req, res, next) => {

    try{
        let token = req.cookies['session-token'];
        // console.log(token)

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        // console.log(ticket)
        const payload = ticket.getPayload();
        // console.log(payload)

        let user = {
            name: payload.name,
            email: payload.email,
            picture: payload.picture
        }
        // console.log(user)
       
        req.user = user;
        next()
    }catch(e){
        res.redirect('/login')
    }
}

module.exports = auth