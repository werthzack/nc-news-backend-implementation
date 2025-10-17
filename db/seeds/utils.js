const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.formatUserData = (users) => {
  return users.map((user) => {
    return Object.values(user);
  });
};

exports.formatTopicsData = (topics) => {
  return topics.map((topic) => {
    const { slug, description, img_url } = topic;
    return [slug, description, img_url];
  });
};

exports.formatArticlesData = (articles) => {
  return articles.map((article) => {
    return Object.values(this.convertTimestampToDate(article));
  });
};

exports.formatCommentsData = (comments, articleLookup) => {
  return comments.map((comment) => {
    const { article_title, body, votes, author, created_at } = comment;

    const article_id = articleLookup.find((article) => {
      return article.title === article_title;
    }).article_id;

    return Object.values(
      this.convertTimestampToDate({
        article_id,
        body,
        votes,
        author,
        created_at,
      })
    );
  });
};
