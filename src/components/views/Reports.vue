<template>
  <div id="reports-container">
    <div id="reports-header-container">
      <div id="reports-header">
        <h2>Reports</h2>
        <span>Easily generate a report of your transactions</span>
      </div>
      <div id="reports-actions">
        <dropdown :config="{
          options:this.gateways,
          defaultValue:'All Gateways',
          value:'gatewayId',
          text:'name'

        }"
                  @optionChange="setSelectedGateway"
                  v-if="gateways.length >0">

        </dropdown>

        <dropdown :config="{
          options:this.projects,
          defaultValue:'All projects',
          value:'projectId',
          text:'name'
        }"
                  @optionChange="setSelectedProject"
                  v-if="projects.length >0">

        </dropdown>
        <datetime v-model="fromDate" placeholder="From Date" prefix-class="dashb" :readonly='true'>
          <template slot="icon-calendar" slot-scope="scope">
            <span class="dsb-calendar"></span>
          </template>
        </datetime>
        <datetime v-model="toDate" placeholder="To Date" prefix-class="dashb">
          <template slot="icon-calendar" slot-scope="scope">
            <span class="dsb-calendar"></span>
          </template>
        </datetime>

        <div id="generate-report-button" @click="generateReport">
          <span>Generate Report</span>

        </div>

      </div>
    </div>
    <div id="project-list-container">
      <template v-if="payments.length >0">
        <template>
          <div id="payments-list-container"
               v-bind:class="{'half-space':((selectedGateway && !selectedProject) || (selectedProject && !selectedGateway)) }">
            <div id="payments-header">
              {{ selectedProject ? selectedProject.name : 'All projects' }} |
              {{ selectedGateway ? selectedGateway.name : 'All gateways' }}
            </div>
            <template v-if="!selectedProject">
              <template v-for="(projectGroup,projectId) in paymentsPerProject">
                <div class="collapsible" @click="openProjectPanel(projectId)"><span>{{
                    projectMap[projectId].name
                  }}</span>
                  <span
                      class="total-amount">TOTAL: {{
                      projectGroup.amount | numberWithCommasNoDecimals
                    }} USD</span>
                </div>
                <div class="content" v-bind:class="{'active':openPanelId === projectId}">
                  <table>
                    <tr>
                      <th>Date</th>
                      <th v-if="!selectedGateway">Gateway</th>
                      <th>Transaction ID</th>
                      <th>Amount</th>
                    </tr>
                    <tr v-for="payment in projectGroup.payments">
                      <td>{{ payment.created }}</td>
                      <td v-if="!selectedGateway">{{ gatewayMap[payment.gatewayId].name }}</td>
                      <td>{{ payment.paymentId }}</td>
                      <td>{{ payment.amount | numberWithCommasNoDecimals }} USD</td>
                    </tr>
                  </table>
                </div>
              </template>
            </template>
            <template v-if="selectedProject && !selectedGateway">
              <template v-for="(gatewayGroup,gatewayId) in paymentsPerGateway">
                <div class="collapsible" @click="openProjectPanel(gatewayId)"><span>{{
                    gatewayMap[gatewayId].name
                  }}</span>
                  <span
                      class="total-amount">TOTAL: {{
                      gatewayGroup.amount | numberWithCommasNoDecimals
                    }} USD</span>
                </div>
                <div class="content" v-bind:class="{'active':openPanelId === gatewayId}">
                  <table>
                    <tr>
                      <th>Date</th>
                      <th v-if="!selectedGateway">Gateway</th>
                      <th>Transaction ID</th>
                      <th>Amount</th>
                    </tr>
                    <tr v-for="payment in gatewayGroup.payments">
                      <td>{{ payment.created }}</td>
                      <td>{{ payment.paymentId }}</td>
                      <td>{{ payment.amount | numberWithCommasNoDecimals }} USD</td>
                    </tr>
                  </table>
                </div>
              </template>
            </template>

            <template v-if="selectedProject && selectedGateway">
              <table>
                <tr>
                  <th>Date</th>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                </tr>
                <tr v-for="payment in paymentsPerProject[selectedProject.projectId].payments">
                  <td>{{ payment.created }}</td>
                  <td v-if="!selectedGateway">{{ gatewayMap[payment.gatewayId].name }}</td>
                  <td>{{ payment.paymentId }}</td>
                  <td>{{ payment.amount | numberWithCommasNoDecimals }} USD</td>
                </tr>
              </table>

            </template>
          </div>

        </template>
        <template v-if="selectedGateway && !selectedProject">
          <div class="chart-container">
            <div class="chart-legends">
              <div v-for="(projectId,i) in Object.keys(paymentsPerProject)" class="legend-container">
                <div :style="{background:chartLabelColors[i]}" class="legend-color"></div>
                <span>{{ projectMap[projectId].name }}</span>
              </div>
            </div>

            <ReportPieChart :chartdata="chartDataTransformedProject"
                            :options="getChartOptions()"></ReportPieChart>
            <div id="gateway-total">
            <span>
            GATEWAY TOTAL | {{
                calculateGatewayTotal() | numberWithCommasNoDecimals
              }}
          </span></div>
          </div>

        </template>
        <template v-if="!selectedGateway && selectedProject">
          <div class="chart-container">
            <div class="chart-legends">
              <div v-for="(gatewayId,i) in Object.keys(paymentsPerGateway)" class="legend-container">
                <div :style="{background:chartLabelColors[i]}" class="legend-color"></div>
                <span>{{ gatewayMap[gatewayId].name }}</span>
              </div>
            </div>

            <ReportPieChart :chartdata="chartDataTransformedGateway"
                            :options="getChartOptions()"></ReportPieChart>
            <div id="project-total">
            <span>
            PROJECT TOTAL | {{
                calculateProjectTotal() | numberWithCommasNoDecimals
              }}
          </span></div>
          </div>

        </template>
      </template>
      <div v-if="payments.length === 0" id="no-data-container">
        <div id="no-data-text">
          <h2>No payments</h2>
          <span>Currently you have no data for the payments to be generated. Once you start generating traffic through the Balance application the payments will be shown.</span>
        </div>
        <img src="../../assets/images/noData.svg" alt="">
      </div>

    </div>


  </div>

</template>

<script>
import dropdown from "@/components/generic/dropdown";
import DatePicker from 'vue2-datepicker';
import ReportPieChart from "@/components/views/ReportPieChart";

export default {
  name: "Reports",
  components: {
    dropdown,
    ReportPieChart,
    datetime: DatePicker
  },
  data: () => {
    return {
      fromDate: null,
      toDate: null,
      selectedGateway: null,
      selectedGatewayTemp: null,
      selectedProject: null,
      selectedProjectTemp: null,
      chartLabelColors: [],
      openPanelId: 0,
    }
  },
  computed: {
    projects: function () {
      return this.$store.state.projects
    },
    projectMap: function () {
      return this.$store.state.projects.reduce((list, project) => {
        return {
          ...list,
          [project['projectId']]: project,
        };
      }, {})

    },
    gateways: function () {
      return this.$store.state.gateways
    },
    gatewayMap: function () {
      return this.$store.state.gateways.reduce((list, gateway) => {
        return {
          ...list,
          [gateway['gatewayId']]: gateway,
        };
      }, {})
    },
    payments: function () {
      return this.$store.state.payments
    },
    /*
    Payments grouped per gateway
    */
    paymentsPerGateway: function () {
      return JSON.parse(JSON.stringify(this.$store.state.payments)).reduce((list, payment) => {
        return {
          ...list,
          [payment['gatewayId']]: list[payment['gatewayId']] && list[payment['gatewayId']].payments ? (
                  {
                    payments: list[payment['gatewayId']].payments.concat([payment]),
                    amount: list[payment['gatewayId']].amount += payment.amount
                  }) :
              {payments: [], amount: 0}
        };
      }, {})
    },
    /*
    Payments grouped per project
    */
    paymentsPerProject: function () {
      return this.$store.state.payments.reduce((list, payment) => {
        return {
          ...list,
          [payment['projectId']]: list[payment['projectId']] && list[payment['projectId']].payments ? (
                  {
                    payments: list[payment['projectId']].payments.concat([payment]),
                    amount: list[payment['projectId']].amount += payment.amount
                  }) :
              {payments: [], amount: 0},
        };
      }, {})
    },
    chartDataTransformedProject: function () {
      return this.transformChartData(Object.values(this.paymentsPerProject), Object.keys(this.paymentsPerProject), this.projectMap)
    },
    chartDataTransformedGateway: function () {
      return this.transformChartData(Object.values(this.paymentsPerGateway), Object.keys(this.paymentsPerGateway), this.gatewayMap)
    }
  },
  methods: {
    calculateProjectTotal:function (){
      return this.chartDataTransformedGateway.datasets[0].data.reduce((total, amount) => total += amount, 0).toFixed()
    },
    calculateGatewayTotal:function (){
      return this.chartDataTransformedProject.datasets[0].data.reduce((total, amount) => total += amount, 0).toFixed()
    },
    getChartOptions:function (){
      //Return options on demand. This way we can bind the Vue context so can use the filters that are bound to the Vue instance
      return {
        responsive: true,
            maintainAspectRatio: false,
            legend: {
          display: false
        },

        tooltips: {
          callbacks: {
            label: function(currentEntry,context) {
              let currentIndex = currentEntry.index;
              let label = `${context.labels[currentIndex] || ''}: ${this.$options.filters.numberWithCommasNoDecimals(context.datasets[0].data[currentIndex])} USD`;
              return label;
            }.bind(this)
          },
          backgroundColor: "#FAFAFA",
              borderColor: "lightgreen",
              borderWidth: 1,
              titleFontColor: "black",
              titleFontStyle: "bold",
              displayColors: false,
              bodyFontColor: "black"
        }
      }

    },
    /*
      Generates a random color hex
     */
    generateColorHex: function () {
      return this.mycolor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
    },
    /*
     Transform tha various payments data in a structure that can be used by the Doughnut Chart
     */
    transformChartData(data, keys, dataMap) {
      this.chartLabelColors = [];
      //Add a color for each label
      keys.forEach(() => {
        this.chartLabelColors.push(this.generateColorHex())
      });
      return {
        labels: keys.map(function (entry) {
          return dataMap[entry].name
        }.bind(this)),
        datasets: [{
          backgroundColor: this.chartLabelColors,
          data: data.map(function (entry) {
            return entry.amount
          })
        }]
      }

    },
    openProjectPanel: function (id) {
      this.openPanelId = id
    },
    setSelectedGateway(option) {
      this.selectedGatewayTemp = option
    }
    ,
    setSelectedProject(option) {
      this.selectedProjectTemp = option

    },
    generateReport() {
      this.selectedGateway = this.selectedGatewayTemp
      this.selectedProject = this.selectedProjectTemp
      this.$store.dispatch('getReport', {
        from: new Date(this.fromDate).toISOString().split('T')[0],
        to: new Date(this.toDate).toISOString().split('T')[0],
        projectId: this.selectedProject?.projectId,
        gatewayId: this.selectedGateway?.gatewayId,
      })


    }
  },
  mounted() {
    this.$store.dispatch('getProjects')
    this.$store.dispatch('getGateways')
  }
}
</script>

<style scoped>
#no-data-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 140px;
}

#no-data-text > h2 {
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;
  text-align: center;

  color: #011F4B;
}

#no-data-text {
  width: 470px;
  padding-bottom: 50px;

}

#no-data-text > span {
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  display: flex;
  color: #7E8299;
}

.legend-container {
  display: flex;
  margin-right: auto;
  margin-left: auto;
  align-items: center;
}

.legend-container > span {
  margin-left: 12px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;

  color: #011F4B;
}

.chart-legends {
  background-color: #F1FAFE;
  border-radius: 10px;
  padding: 18px;
  justify-content: center;

  display: flex;
  width: 100%;
  margin-bottom: 20px;
}

.legend-color {
  width: 15px;
  height: 15px;
  border-radius: 5px;
}

#gateway-total > span {
  padding: 17px 20px;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;


  color: #011F4B;
}

#gateway-total {
  background-color: #F1FAFE;
  border-radius: 10px;
  display: flex;
  margin-top: 40px;

}

#project-total > span {
  padding: 17px 20px;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;


  color: #011F4B;
}

#project-total {
  background-color: #F1FAFE;
  border-radius: 10px;
  display: flex;
  margin-top: 40px;

}

#payments-list-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #F1FAFE;

}

.half-space {
  width: 50% !important;

}

#payments-header {
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  /* identical to box height */
  margin: 18px 24px;


  color: #011F4B;
}

#reports-container {
  min-height: calc(100% - 215px);
  display: flex;
  flex-direction: column;
  margin-left: 100px;

  margin-right: 100px;
  padding-top: 35px;
  margin-bottom: 25px;
}

#reports-header-container {
  display: flex;
  align-items: center;
}

#reports-header > h2 {
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;
  margin: 0px 0px 2px 0px;

  color: #011F4B;
}

#reports-header > span {
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;

  color: #7E8299;
}

#reports-actions {
  display: flex;
  margin-left: auto;
}

#project-list-container {
  display: flex;
  margin-top: 27px;
  padding-bottom: 15px;
  justify-content: center;
}

.chart-container {
  margin-left: 31px;
  position: relative;
  display: flex;
  width: 50%;
  flex-direction: column;
}

/*Expansion Panel */
.collapsible {
  color: black;
  cursor: pointer;
  padding: 18px;
  /*width: 100%;*/
  display: flex;
  border-radius: 10px;

  border: none;
  text-align: left;
  outline: none;
  font-size: 15px;
  background: #FFFFFF;
  margin: 14px 18px;

}

.total-amount {
  margin-left: auto;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 164.4%;

  text-align: right;

  color: #011F4B;
}

.active, .collapsible:hover {
  background-color: #F1FAFE;
  display: flex !important;
  max-height: 1500px !important;
  /*transform: scale(1,1) !important;*/
  transition: max-height 2s ease-in-out;

}

.content {
  padding: 0 18px;
  overflow: hidden;
  max-height: 0px;

  transform-origin: bottom;
  background-color: #F1FAFE;
}

#generate-report-button {
  background: #005B96;
  border-radius: 5px;
  display: flex;
  cursor: pointer;
}

#generate-report-button > span {
  color: #FFFFFF;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  padding: 8px 10px;
}

/*Table*/
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  text-align: left;
  padding: 10px 21px;
}

td:last-child, th:last-child {
  text-align: right;
  padding: 10px 21px;
}

tr:nth-child(odd) {
  background: #FFFFFF;
}
</style>
<style>
.dashb-datepicker {
  width: 118px !important;
  cursor: pointer;

}

.dashb-icon-calendar, .dashb-icon-clear {
  top: 45%!important;
}

.dashb-input {
  background: #1BC5BD !important;
  padding: 8px 18px !important;
  pointer-events: none;
}

.dashb-input::placeholder {
  color: #FFFFFF !important;
}

.dashb-icon-clear {
  color: #FFFFFF !important;
}

.dsb-calendar {
  font-size: 12px;
  padding-right: 4px;
}

#reports-actions > div:not(:last-child) {
  margin-right: 23px;
}

</style>
