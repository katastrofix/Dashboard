// @ts-nocheck
import Vue from 'vue';
import Vuex from 'vuex';
import Axios from 'axios'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        projects:[],
        users:[],
        gateways:[],
        payments:[],
        sidebarOpen:true
    },
    mutations: {
        setSidebarOpen:function (state, payload){
            state.sidebarOpen = payload;
        },
        setProjects: function (state, payload) {
            state.projects = payload;
        },
        setUsers: function (state, payload) {
            state.users = payload;
        },
        setGateways: function (state, payload) {
            state.gateways = payload;
        },
        setReport: function (state, payload) {
            state.payments = payload;
        }
    },
    actions: {
        getProjects: function (store, payload) {
            Axios.get( `http://178.63.13.157:8090/mock-api/api/projects`, {}).then(function (response) {
                store.commit('setProjects', response.data.data)
            }).catch(function (error) {
                // handle error
                console.log(error);
            })
        },
        getUsers: function (store, payload) {
            Axios.get( `http://178.63.13.157:8090/mock-api/api/users`, {}).then(function (response) {
                store.commit('setUsers', response.data.data)
            }).catch(function (error) {
                // handle error
                console.log(error);
            })

        },
        getGateways: function (store, payload) {
            Axios.get( `http://178.63.13.157:8090/mock-api/api/gateways`, {}).then(function (response) {
                store.commit('setGateways', response.data.data)
            }).catch(function (error) {
                // handle error
                console.log(error);
            })
        },
        getReport: function (store, payload) {
            Axios.post( `http://178.63.13.157:8090/mock-api/api/report`, payload).then(function (response) {
                store.commit('setReport', response.data.data)
            }).catch(function (error) {
                // handle error
                console.log(error);
            })

        }


    },
    modules: {},
});
