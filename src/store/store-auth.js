// import {
//   signInWithPopup,
//   GoogleAuthProvider,
//   signOut,
//   getAuth,
//   onAuthStateChanged,
// } from "firebase/auth";

// const provider = new GoogleAuthProvider();

// const state = {
//   authIsReady: false,  // ログイン状態が確認出来たい際 true
//   user: null,  // ユーザーの情報 { displayName, photoURL }
//   loggedIn: false,  // ログイン状態
//   error: null,  // 認証によるエラーを保持
// };

// const mutations = {
//   setAuthIsReady(state, status) {
//     state.authIsReady = status;
//   },

//   setUser(state, user) {
//     state.user = user;
//   },

//   setLoggedIn(state, status) {
//     state.loggedIn = status;
//   },

//   setError(state, error) {
//     state.error = error;
//   },
// };

// const actions = {
//   login: async function ({ commit }) {
//     try {
//       const res = await signInWithPopup(getAuth(), provider);
//       this.$router.push({ name: "settings" });
//       commit("setError", null);
//     } catch (error) {
//       commit("setError", error);
//     }
//   },

//   logout: function ({ commit }) {
//     try {
//       signOut(getAuth());
//       this.$router.push({ name: "home" }).catch((err) => {});
//       commit("setError", null);
//     } catch (error) {
//       commit("setError", error);
//     }
//   },

//   onAuth: function ({ commit }) {
//     return new Promise((resolve) => {
//       onAuthStateChanged(getAuth(), (user) => {
//         let userData = {};
//         if (user) {
//           const { displayName, photoURL } = user;
//           userData = { displayName, photoURL };
//         }
        
//         commit("setUser", user ? userData : null);
//         commit("setLoggedIn", user ? true : false);
//         commit("setAuthIsReady", true);
//         resolve();
//       });
//     });
//   },
// };

// const getters = {
//   authIsReady(state) {
//     return state.authIsReady;
//   },

//   user(state) {
//     return state.user;
//   },

//   loggedIn(state) {
//     return state.loggedIn;
//   },

//   error(state) {
//     return state.error;
//   },
// };

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions,
//   getters,
// };
