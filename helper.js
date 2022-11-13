const jwt = require('jsonwebtoken');

function getOffset(currentPage = 1, listPerPage) {
  return (currentPage - 1) * [listPerPage];
}

function getCountPages(currentPage = 1, listPerPage, totalRows) {
  var nextPage;
  var lastPage;
  if (currentPage * listPerPage < totalRows) {
    nextPage = Number(currentPage) + 1;
  } else {
    nextPage = Number(currentPage);
  };
  if (totalRows % listPerPage == 0) {
    lastPage = totalRows / listPerPage;
  } else {
    lastPage = (Math.trunc(totalRows / listPerPage)) + 1;
  }
  return ({ nextPage, lastPage });
}

function emptyOrRows(rows) {
  if (!rows) {
    return [];
  }
  return rows;
}

function isLoggedIn(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(
      token,
      'syny'
    );
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).send({
      msg: 'Your session is not valid!'
    });
  }
}

module.exports = {
  getOffset,
  emptyOrRows,
  getCountPages,
  isLoggedIn
}