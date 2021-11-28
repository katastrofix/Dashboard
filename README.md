# Dashboard

This Dashboard implementation uses Vue.js as its core library and various additional libraries from the Vue ecosystem, namely:

* [Vue CLI](https://cli.vuejs.org/) : A tool to accelarate project setup and management.
* [Vuex](https://vuex.vuejs.org/#what-is-a-state-management-pattern) : A library for state management.
* [Vue chart.js](https://vue-chartjs.org/) : An integration library for the Chart.js library.
* [Vue2 datepicker](https://github.com/mengxiong10/vue2-datepicker)  : A datepicker plugin.
* [Axios](https://github.com/axios/axios) : A promise based HTTP client 


In addition, Typescript is included but not strictly used. 

# Project structure
Configurations file are at root level `./`

App entry point is the `main.ts` at `./src`

Vue root component is the `App.vue` at `./src`

Vuex files are located at `./src/vuexDatastore`

Vue components are located at `./src/components`



Various assets required by the project are included locally, such as:

* Dashboard Fonts at  `./src/assets/fonts`
* Images and Logos at `./src/assets/images`
* Scss style overrides for plugins at `./src/assets/images`

## Project setup
```
npm install
```

### Compiles and hot-reloads for development (Default port is: http://localhost:5500/)
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Runs the Vue Cli User Interface.
```
vue ui
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
