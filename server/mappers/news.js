exports.Map = (dbNews) => {
  return {
    id: dbNews.Id,
    theme: dbNews.Theme,
    text: dbNews.Text,
    date: dbNews.Date,
    user: dbNews.User
  }
};