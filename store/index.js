import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		userPassword:localStorage.getItem("userPassword") ? localStorage.getItem("userPassword") : "",
		userID: localStorage.getItem("userID") ? localStorage.getItem("userID") : "",
		userName: localStorage.getItem("userName") ? localStorage.getItem("userName") : "",
		userImg:localStorage.getItem("userImg") ? localStorage.getItem("userImg") : "",
		userToken:localStorage.getItem("userToken") ? localStorage.getItem("userToken") : "",
	},
    mutations: {
		changeUserID(state, userID) {
		      localStorage.setItem("userID", userID);
		      state.userID = userID;
		},
		changeUserName(state, userName) {
		      localStorage.setItem("userName", userName);
		      state.userName = userName;
		},
		changeUserPassword(state, userPassword) {
		      localStorage.setItem("userPassword", userPassword);
		      state.userPassword = userPassword;
		},
		changeUserImg(state, userImg) {
		      localStorage.setItem("userImg", userImg);
		      state.userImg = userImg;
		},
		changeUserToken(state, userToken) {
		      localStorage.setItem("userToken", userToken);
		      state.userToken = userToken;
		},
	},
    actions: {}
})
export default store