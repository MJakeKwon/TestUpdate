import { createStore } from 'vuex';
import moment from "moment";

const store = createStore({
  state() {
    return {
      userId: "",       
      routine: "",      
      week: null,       
      setNumber: 0,     
      setWeight: 0,     
      restTime: 0,      
    };
  },
  mutations: {
    setUserId(state, userId) {
      state.userId = userId;
    },
    setRoutine(state, routine) {
      state.routine = routine;
    },
    setSetWeight(state, setWeight) {
      state.setWeight = setWeight;
    },
    setRestTime(state, restTime) {
      state.restTime = restTime;
    },
    setWeek(state) {
      const today = moment();
      const startOfMonth = today.clone().startOf("month");
      const diffWeeks = today.diff(startOfMonth, "weeks") + 1;
      state.week = diffWeeks;
    },
    incrementSetNumber(state) {
      state.setNumber += 1;
    },
  },
  actions: {
    updateUserId({ commit }, userId) {
      commit("setUserId", userId);
    },
    updateRoutine({ commit }, routine) {
      commit("setRoutine", routine);
    },
    updateSetWeight({ commit }, setWeight) {
      commit("setSetWeight", setWeight);
    },
    updateRestTime({ commit }, restTime) {
      commit("setRestTime", restTime);
    },
    updateWeek({ commit }) {
      commit("setWeek");
    },
    increaseSetNumber({ commit }) {
      commit("incrementSetNumber");
    },
  },
  getters: {
    getUserId: state => state.userId,
    getRoutine: state => state.routine,
    getSetWeight: state => state.setWeight,
    getRestTime: state => state.restTime,
    getWeek: state => state.week,
    getSetNumber: state => state.setNumber,
  }
});

export default store;