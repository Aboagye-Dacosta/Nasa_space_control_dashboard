//check whether they return the correct data
const { getPagination, getSort } = require("../services/query");

describe("Test pagination function", () => {
  test("should return an object with limit and skip properties", () => {
    const query = {
      page: 1,
      limit: 10,
    };

    const result = getPagination(query);
    expect(result).toHaveProperty("limit");
    expect(result).toHaveProperty("skip");

    expect(result).toEqual({
      limit: 10,
      skip: 0,
    });
  });

  test("should return the default values of limit and skip when wrong keys are passed", () => {
    const wrongQuery = {
      pages: 1,
      limits: 10,
    };
    const results = getPagination(wrongQuery);
    expect(results).toEqual({
      skip: 0,
      limit: 0,
    });
  });

  test("should return the default values of limit and skip when empty object is passed", () => {
    const empty = {};
    const results = getPagination(empty);
    expect(results).toEqual({
      skip: 0,
      limit: 0,
    });
  });
});

describe("Test sort function", () => {
  test("should return the sorting other whether desc:-1 or asc:1", () => {
    //test ascending
    const query = {
      sort: "asc",
    };
    const result = getSort(query);
    expect(result).toBe(1);
  });

  test("should return the default value of sort when wrong key is passed", () => {
    const wrongQuery = {
      sorts: "desc",
    };
    const result = getSort(wrongQuery);
    expect(result).toBe(1);
  });

  test("should return the default value of sort when empty object is passed", () => {
    const empty = {};
    const result = getSort(empty);
    expect(result).toBe(1);
  });

  test("should return the default value of sort when wrong value is passed", () => {
    const wrongValue = {
      sort: "as",
    };
    const result = getSort(wrongValue);
    expect(result).toBe(1);
  });
});
