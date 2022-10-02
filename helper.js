function getOffset(currentPage = 1, listPerPage) {
  return (currentPage - 1) * [listPerPage];
}

function getCountPages(currentPage = 1, listPerPage, totalRows){
  var nextPage;
  var lastPage;
  if (currentPage * listPerPage < totalRows) {
    nextPage = currentPage + 1;
  }else{
    nextPage = currentPage;
  };
  if (totalRows % listPerPage == 0 ) {
    lastPage = totalRows / listPerPage;
  }else{
    lastPage = totalRows / listPerPage + 1;
  }
  return ({nextPage, lastPage});
}

function emptyOrRows(rows) {
  if (!rows) {
    return [];
  }
  return rows;
}

module.exports = {
  getOffset,
  emptyOrRows,
  getCountPages
}