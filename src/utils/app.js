import cookie from "cookie_js";

const adminToKen = "admin_toKen";
const adminUserName = "admin_userName";

export function getToKen() {
  return cookie.get(adminToKen);
}

export function setToKen(toKen) {
  return cookie.set(adminToKen,toKen);
}

export function removeToKen() {
  return cookie.remove(adminToKen);
}

export function getUserName() {
  return cookie.get(adminUserName);
}

export function setUserName(value) {
  return cookie.set(adminUserName,value);
}

export function removeUserName() {
  return cookie.remove(adminUserName);
}