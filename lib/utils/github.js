const fetch = require('cross-fetch');

const exchangeCodeForToken = async (code) => {
  const user = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const tokenBody = await user.json();

  return tokenBody.access_token;
};

const getUserInfo = async (token) => {
  const res = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  const userInfo = await res.json();

  return userInfo;
};

module.exports = { exchangeCodeForToken, getUserInfo };
