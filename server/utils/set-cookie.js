module.exports = (res, cookieKey, token) => {
  res.cookie(cookieKey, JSON.stringify(token), {
    maxAge: ((((1000 * 60) * 60) * 24) * 7),
    path: '/',
    httpOnly: true
  });
};