import { takeLatest, put, all, call } from "typed-redux-saga/macro";
import { User } from "firebase/auth";

import { USER_ACTION_TYPES } from "./user.types";

import {
  signInSuccess,
  signInFailed,
  signOutSuccess,
  signOutFailed,
  signUpSuccess,
  signUpFailed,
  EmailSignInStart,
  SignUpStart,
  SignUpSuccess
} from "./user.action";

import {
  getCurrentUser,
  createUserDocumentFromAuth,
  createAuthUserWithEmailAndPassword,
  signInAuthUserWithEmailAndPassword,
  signInWithGooglePopup,
  signOutUser as signOutFirebase,
  AdditionalInformation,
} from "../../utils/firebase/firebase.utils";

import { AuthError, AuthErrorCodes } from "firebase/auth";

export function* getSnapshotFromUserAuth(
  userAuth: User,
  additionalDetails?: AdditionalInformation,
) {
  try {
    const userSnapshot = yield* call(
      createUserDocumentFromAuth,
      userAuth,
      additionalDetails,
    );
    if (userSnapshot) {
      yield* put(
        signInSuccess({ id: userSnapshot.id, ...userSnapshot.data() }),
      );
    }
  } catch (error) {
    yield* put(signInFailed(error as Error));
  }
}

export function* isUserAuthenticated() {
  try {
    const userAuth = yield* call(getCurrentUser);
    if (!userAuth) return;
    yield* call(getSnapshotFromUserAuth, userAuth);
  } catch (error) {
    yield* put(signInFailed(error as Error));
  }
}

const isAuthError = (error: unknown): error is AuthError => {
  return typeof error === "object" && error !== null && "code" in error;
};

export function* signInUserWithEmailAndPassword({
  payload: { email, password },
}: EmailSignInStart) {
  try {
    const userAuth = yield* call(
      signInAuthUserWithEmailAndPassword,
      email,
      password,
    );
    yield* call(getSnapshotFromUserAuth, userAuth);
  } catch (error) {
    if (isAuthError(error)) {
      switch (error.code) {
        case AuthErrorCodes.INVALID_PASSWORD:
          yield* put(signInFailed(Error("Incorrect password for email")));
          break;
        case AuthErrorCodes.USER_DELETED:
          yield* put(signInFailed(Error("No user associated with this email")));
          break;
        default:
          yield* put(signInFailed(error as Error));
      }
    } else {
      yield* put(signInFailed(error as Error));
    }
  }
}

export function* signInUserWithGoogle() {
  try {
    const userAuth = yield* call(signInWithGooglePopup);
    yield* call(getSnapshotFromUserAuth, userAuth);
  } catch (error) {
    yield* put(signInFailed(error as Error));
  }
}

export function* signOutUser() {
  try {
    yield* call(signOutFirebase);
    yield* put(signOutSuccess());
  } catch (error) {
    yield* put(signOutFailed(error as Error));
  }
}

export function* signUpUser({
  payload: { email, password, displayName },
}: SignUpStart) {
  try {
    const userAuth = yield* call(
      createAuthUserWithEmailAndPassword,
      email,
      password,
    );

    yield* put(signUpSuccess(userAuth, { displayName }));
  } catch (error) {
    if (isAuthError(error)) {
      if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
        yield* put(signUpFailed(Error("Email Already in Use")));
      }
    } else {
      yield* put(signUpFailed(error as Error));
    }
  }
}

export function* signInAfterSignUp({payload: {  user, additionalDetails  }}: SignUpSuccess) {
  yield* call(getSnapshotFromUserAuth, user, additionalDetails);
}

export function* onCheckUserSession() {
  yield* takeLatest(USER_ACTION_TYPES.CHECK_USER_SESSION, isUserAuthenticated);
}

export function* onEmailSignIn() {
  yield* takeLatest(
    USER_ACTION_TYPES.EMAIL_SIGN_IN_START,
    signInUserWithEmailAndPassword,
  );
}

export function* onGoogleSignIn() {
  yield* takeLatest(
    USER_ACTION_TYPES.GOOGLE_SIGN_IN_START,
    signInUserWithGoogle,
  );
}

export function* onSignOutStart() {
  yield* takeLatest(USER_ACTION_TYPES.SIGN_OUT_START, signOutUser);
}

export function* onSignUpStart() {
  yield* takeLatest(USER_ACTION_TYPES.SIGN_UP_START, signUpUser);
}

export function* onSignUpSuccess() {
  yield* takeLatest(USER_ACTION_TYPES.SIGN_UP_SUCCESS, signInAfterSignUp);
}

export function* userSagas() {
  yield* all([
    call(onCheckUserSession),
    call(onEmailSignIn),
    call(onGoogleSignIn),
    call(onSignOutStart),
    call(onSignUpStart),
    call(onSignUpSuccess),
  ]);
}
