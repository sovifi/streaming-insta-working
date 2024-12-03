const express = require('express');
const axios = require('axios');

router.get('/auth/instagram', (req, res) => {
  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${FB_CONFIG.appId}&redirect_uri=${FB_CONFIG.redirectUri}&scope=${FB_CONFIG.scope.join(',')}&response_type=code`;
  res.redirect(authUrl);
});

router.get('/auth/instagram/callback', async (req, res) => {
  const { code } = req.query;
  
  try {
    // Exchange code for access token
    const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token', {
      client_id: FB_CONFIG.appId,
      client_secret: FB_CONFIG.appSecret,
      grant_type: 'authorization_code',
      redirect_uri: FB_CONFIG.redirectUri,
      code
    });

    // Store token in database
    await saveTokenToDatabase(tokenResponse.data.access_token, req.user.id);
    
    res.redirect('/dashboard');
  } catch (error) {
    res.redirect('/error');
  }
}); 