<script>
import {Doughnut} from 'vue-chartjs'
import ChartJSPluginDatalabels from "chartjs-plugin-datalabels";

export default {
  extends: Doughnut,
  props: {
    chartdata: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },
  mounted() {
    this.renderChart(this.chartdata, this.options)
  },
  watch:{
    chartdata:function (){
      this.renderChart(this.chartdata, this.options)
    }
  },
  name: "ReportPieChart"
}
</script>

