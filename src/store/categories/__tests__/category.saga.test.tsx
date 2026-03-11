import { call } from "redux-saga/effects";
import { expectSaga, testSaga } from "redux-saga-test-plan";
import { throwError } from "redux-saga-test-plan/providers";

import { getCategoriesAndDocuments } from "../../../utils/firebase/firebase.utils";

import {
  fetchCategoriesFailed,
  fetchCategoriesSuccess,
} from "../category.action";
import {
  fetchCategoriesAsync,
  onFetchCategories,
  categoriesSaga,
} from "../category.saga";
import { CATEGORIES_ACTION_TYPES } from "../category.types";

jest.mock("typed-redux-saga/macro", () => {
  const effects = require("redux-saga/effects");
  const wrap = (fn: (...args: any[]) => any) =>
    function* (...args: any[]): Generator<any, any, any> {
      return yield fn(...args);
    };
  return {
    call: wrap(effects.call),
    put: wrap(effects.put),
    all: wrap(effects.all),
    takeLatest: wrap(effects.takeLatest),
  };
});

describe("category sagas", () => {
  test("categoriesSaga", () => {
    expectSaga(categoriesSaga).call(onFetchCategories).run();
  });

  test("onFetchCategories", () => {
    testSaga(onFetchCategories)
      .next()
      .takeLatest(
        CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_START,
        fetchCategoriesAsync,
      )
      .next()
      .isDone();
  });

  test("fetchCategoriesAsync success", () => {
    const mockCategoriesArray = [
      { id: 1, name: "Category 1" },
      { id: 2, name: "Category 2" },
    ] as any;
    return expectSaga(fetchCategoriesAsync)
      .provide([[call(getCategoriesAndDocuments), mockCategoriesArray]])
      .put(fetchCategoriesSuccess(mockCategoriesArray))
      .run();
  });

  test("fetchCategoriesAsync failure", () => {
    const mockError = new Error("An error occurred");

    return expectSaga(fetchCategoriesAsync)
      .provide([[call(getCategoriesAndDocuments), throwError(mockError)]])
      .put(fetchCategoriesFailed(mockError))
      .run();
  });
});
