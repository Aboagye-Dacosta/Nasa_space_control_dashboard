const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 0;
const DEFAULT_SORT = "asc";

function getPagination(query) {
  const page = Math.abs(query.page) || DEFAULT_PAGE;
  const limit = Math.abs(query.limit) || DEFAULT_LIMIT;

  const skip = (page - 1) * limit;

  return {
    skip,
    limit,
  };
}

function getSort(query) {
  const sortTypesEnum = {
    desc: -1,
    asc: 1,
  };

    const sort = query.sort?.toLowerCase() || DEFAULT_SORT;
    if(!sortTypesEnum[sort]) return sortTypesEnum[DEFAULT_SORT];
  return sortTypesEnum[sort];
}

module.exports = {
  getPagination,
  getSort,
};
