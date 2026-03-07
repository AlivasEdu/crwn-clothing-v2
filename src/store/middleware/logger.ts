import { Middleware } from "redux";

import { RootState } from '../store';

function isAction(action: unknown): action is { type: string; payload?: unknown } {
    return typeof action === 'object'  && action !== null && "type" in action;
}

export const loggerMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  if (!isAction(action)) {
    return next(action);
  }

  console.log("type", action.type);
  console.log("payload", action.payload);
  console.log("currentState", store.getState());

  const result = next(action);
  console.log("next state: ", store.getState());
  return result;
};