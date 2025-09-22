// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
// NOTE: Use the official SDK for the platforms you integrate!
const { TwitterApi } = require('twitter-api-v2');

// 💡 You MUST set these as environment variables (e.g., in a .env file)
const { TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET, CALLBACK_URL } = process.env;

// Route to start the Twitter OAuth flow
router.get('/twitter/login', async(req, res) => {
    try {
        // 1. Initialize the client for OAuth 2.0
        const client = new TwitterApi({
            clientId: TWITTER_CLIENT_ID,
            clientSecret: TWITTER_CLIENT_SECRET
        });

        // 2. Generate the authorization URL and state/verifier for security
        const { url, codeVerifier, state } = client.generateAuthURL({
            // Scope defines what permissions you need (post/read)
            scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
            redirectUri: CALLBACK_URL + '/api/auth/twitter/callback',
        });

        // 3. Save the temporary verifier/state data (e.g., in a session or database)
        // You need this to verify the callback in the next step!
        // For a hackathon, saving it to a session is simplest:
        // req.session.codeVerifier = codeVerifier;
        // req.session.state = state;

        // 4. Redirect the user to Twitter to authorize
        return res.redirect(url);
    } catch (error) {
        console.error('Twitter login error:', error);
        res.status(500).send('Error initiating Twitter login.');
    }
});

module.exports = router;
router.get('/twitter/callback', async(req, res) => {
    // 1. Get code from URL (provided by Twitter) and the saved verifier/state
    const { code, state } = req.query;
    // const codeVerifier = req.session.codeVerifier; // Retrieve the saved verifier/state
    // const savedState = req.session.state;

    // 2. Basic security check (must match saved state)
    // if (!codeVerifier || !state || state !== savedState) {
    //     return res.status(400).send('State validation failed or missing data.');
    // }

    try {
        const client = new TwitterApi({
            clientId: TWITTER_CLIENT_ID,
            clientSecret: TWITTER_CLIENT_SECRET
        });

        // 3. Exchange the temporary code for permanent tokens
        const {
            client: loggedClient,
            accessToken,
            refreshToken,
            expiresIn
        } = await client.loginWithOAuth2({
            code,
            redirectUri: CALLBACK_URL + '/api/auth/twitter/callback',
            // codeVerifier: codeVerifier 
        });

        // 4. Get the user's ID to save the token against it
        const { data: user } = await loggedClient.v2.me();

        // 5. ⭐️ CRITICAL: SAVE TOKENS TO DATABASE ⭐️
        // Example: await User.findByIdAndUpdate(req.user.id, { 
        //     twitterAccessToken: accessToken, 
        //     twitterRefreshToken: refreshToken 
        // });

        // 6. Redirect the user back to the frontend settings page
        res.redirect('/settings?status=twitter_success');

    } catch (error) {
        console.error('Twitter callback error:', error);
        res.status(500).send('Twitter authentication failed.');
    }
});