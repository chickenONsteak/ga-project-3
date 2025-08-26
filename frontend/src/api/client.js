// // fetch wrapper + baseURL + auth header
// // src/api/client.js
// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

// //storing token in localstorage
// const ACCESS_KEY = "access_token";
// // const REFRESH_KEY = "refresh_token";

// export function getAccessToken() {
//   return localStorage.getItem(ACCESS_KEY) || ""; //gets accesskey from localstorage or return "" for guests
// }
// // export function getRefreshToken() {
// //   return localStorage.getItem(REFRESH_KEY) || "";
// // }

// // export function saveTokens({ access, refresh }) {
// export function saveTokens({ access }) {
//   if (access) localStorage.setItem(ACCESS_KEY, access); //stores accesskey in localstorage
//   //   if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
// }
// export function clearTokens() {
//   //clear during logout
//   localStorage.removeItem(ACCESS_KEY);
//   //   localStorage.removeItem(REFRESH_KEY);
// }

// export async function apiClient(
//   path,
//   { method = "GET", body, headers = {} } = {}
// ) {
//   //able to get and use endpoint,
//   const res = await fetch(BASE_URL + path, {
//     method,
//     headers: {
//       "Content-Type": "application/json",
//       ...(getAccessToken()
//         ? { Authorization: `Bearer ${getAccessToken()}` }
//         : {}), //to get accesstoken if available
//     },
//     body: body !== undefined ? JSON.stringify(body) : undefined, //if provided, conver to json
//   });

//   if (res.status === 204) return null; //if no content return null

//   const data = await res.json().catch(() => ({}));
//   if (res.ok) {
//     return data;
//   }
//   const message =
//     (typeof data?.msg === "string" && data.msg) || "Request failed"; //fallback error msg
//   throw new Error(message);
// }

// //methods from postman
// export const get = (path) => apiClient(path);
// export const post = (path, body) => apiClient(path, { method: "POST", body });
// export const patch = (path, body) => apiClient(path, { method: "PATCH", body });
// export const del = (path, body) =>
//   body !== undefined
//     ? apiClient(path, { method: "DELETE", body })
//     : apiClient(path, { method: "DELETE" });
