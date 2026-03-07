import { UnknownAction } from "redux";

import { UserData } from "../../utils/firebase/firebase.utils";
import {
  emailSignInStart,
  googleSignInStart,
  signUpStart,
  signOutStart,
  signInSuccess,
  signOutSuccess,
  signInFailed,
  signUpFailed,
  signOutFailed,
} from "./user.action";

export type UserState = {
  readonly currentUser: UserData | null;
  readonly isLoading: boolean;
  readonly error: Error | null;
};

const INITIAL_STATE: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
};

export const userReducer = (
  state = INITIAL_STATE,
  action: UnknownAction,
): UserState => {
  if (
    emailSignInStart.match(action) ||
    googleSignInStart.match(action) ||
    signUpStart.match(action) ||
    signOutStart.match(action)
  ) {
    return {
      ...state,
      isLoading: true,
    };
  }
  if (signInSuccess.match(action)) {
    return {
      ...state,
      isLoading: false,
      currentUser: action.payload,
    };
  }
  if (signOutSuccess.match(action)) {
    return {
      ...state,
      isLoading: false,
      currentUser: null,
    };
  }
  if (
    signInFailed.match(action) ||
    signUpFailed.match(action) ||
    signOutFailed.match(action)
  ) {
    return {
      ...state,
      isLoading: false,
      error: action.payload,
    };
  }
  return state;
};
