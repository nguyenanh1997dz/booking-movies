const pageNotFound = (req, res, next) => {
    const error = new Error(`Page Not Found : ${req.originalUrl}`);
    res.status(404);
    next(error);
  };

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
     res.json({
      status: false,
      message: err?.message,
    });
  };
  module.exports = {pageNotFound,errorHandler}
  