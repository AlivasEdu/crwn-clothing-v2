import { takeLatest, put, all, call } from "redux-saga/effects";

import { USER_ACTION_TYPES } from "./user.types";

import {
  signInSuccess,
  signInFailed,
  signOutSuccess,
  signOutFailed,
  signUpSuccess,
  signUpFailed,
} from "./user.action";

import {
  getCurrentUser,
  createUserDocumentFromAuth,
  createAuthUserWithEmailAndPassword,
  signInAuthUserWithEmailAndPassword,
  signInWithGooglePopup,
  signOutUser as signOutFirebase,
} from "../../utils/firebase/firebase.utils";

export function* getSnapshotFromUserAuth(userAuth, additionalDetails) {
  console.log(userAuth);
  console.log(additionalDetails);
  try {
    const userSnapshot = yield call(
      createUserDocumentFromAuth,
      userAuth,
      additionalDetails,
    );
    yield put(signInSuccess({ id: userSnapshot.id, ...userSnapshot.data() }));
  } catch (error) {
    yield put(signInFailed(error));
  }
}

export function* isUserAuthenticated() {
  try {
    const userAuth = yield call(getCurrentUser);
    if (!userAuth) return;
    yield call(getSnapshotFromUserAuth, userAuth);
  } catch (error) {
    yield put(signInFailed(error));
  }
}

export function* signInUserWithEmailAndPassword({
  payload: { email, password },
}) {
  try {
    const userAuth = yield call(
      signInAuthUserWithEmailAndPassword,
      email,
      password,
    );
    yield call(getSnapshotFromUserAuth, userAuth);
  } catch (error) {
    switch (error.code) {
        case "auth/wrong-password":
          yield call(signInFailed("Incorrect password for email"));
          break;
        case "auth/user-not-found":
          yield call(signInFailed("No user associated with this email"));
          break;
        default:
          yield call(signInFailed(error));
      }
  }
}

export function* signInUserWithGoogle() {
  try {
    const userAuth = yield call(signInWithGooglePopup);
    yield call(getSnapshotFromUserAuth, userAuth);
  } catch (error) {
    yield put(signInFailed(error));
  }
}

export function* signOutUser() {
  try {
    yield call(signOutFirebase);
    yield put(signOutSuccess());
  } catch (error) {
    yield put(signOutFailed(error));
  }
}

export function* signUpUser({ payload: { email, password, displayName } }) {
  try {
    const userAuth = yield call(
      createAuthUserWithEmailAndPassword,
      email,
      password,
    );
    yield put(signUpSuccess(userAuth, displayName));
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      yield put(signUpFailed("Email Already in Use"));
    } else {
      yield put(signUpFailed(error));
    }
  }
}

export function* signInAfterSignUp(action) {
  console.log('SIGN UP SUCCESS action: ', action);
  yield call(getSnapshotFromUserAuth, action.payload.user, { displayName: action.payload.displayName });
}

export function* onCheckUserSession() {
  yield takeLatest(USER_ACTION_TYPES.CHECK_USER_SESSION, isUserAuthenticated);
}

export function* onEmailSignIn() {
  yield takeLatest(
    USER_ACTION_TYPES.EMAIL_SIGN_IN_START,
    signInUserWithEmailAndPassword,
  );
}

export function* onGoogleSignIn() {
  yield takeLatest(
    USER_ACTION_TYPES.GOOGLE_SIGN_IN_START,
    signInUserWithGoogle,
  );
}

export function* onSignOutStart() {
  yield takeLatest(USER_ACTION_TYPES.SIGN_OUT_START, signOutUser);
}

export function* onSignUpStart() {
  yield takeLatest(USER_ACTION_TYPES.SIGN_UP_START, signUpUser);
}

export function* onSignUpSuccess() {
  yield takeLatest(USER_ACTION_TYPES.SIGN_UP_SUCCESS, signInAfterSignUp);
}

export function* userSagas() {
  yield all([
    call(onCheckUserSession),
    call(onEmailSignIn),
    call(onGoogleSignIn),
    call(onSignOutStart),
    call(onSignUpStart),
    call(onSignUpSuccess),
  ]);
}
