// return the user data from the session storage
export const getUser = () => {
  const userStr = sessionStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);
  else return null;
};

// return the token from the session storage
export const getToken = () => {
  return sessionStorage.getItem("token") || null;
};
export const getrefToken = () => {
  return sessionStorage.getItem("refreshToken") || null;
};

// remove the token and user from the session storage
export const removeUserSession = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");

  sessionStorage.removeItem("refreshToken");
};

// set the token and user from the session storage
export const setUserSession = (token, user, reftoken) => {
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("refreshToken", reftoken);
  sessionStorage.setItem("user", JSON.stringify(user));
};
