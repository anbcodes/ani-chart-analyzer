<template>
  <v-app>
    <v-app-bar app hide-on-scroll>
      <v-toolbar-title><span class="display-1">Google Docs ANI Chart Analyzer</span></v-toolbar-title>
      <v-spacer />
      <span class="title">Chart Format Available <a href="https://docs.google.com/document/d/1I8RF0tlCcFS58eMYk43Tbvs224opg221N7jTPqoHl3g/edit?usp=sharing" target="_blank" rel="noopener noreferrer">Here</a></span>
    </v-app-bar>
    <v-content>
      <v-container>
        <v-row justify="center">
          <div>
            <div id="ANI" ref="ANI" contenteditable="true" @input="updateANI"></div>
            <v-container>
              <v-row>
                <div id="summary" ref="summary" v-if="showSummary" v-html="summary"></div>
              </v-row>
            </v-container>
            <v-container>
              <v-row>
                <v-col cols="6">
                  <v-btn block @click="reorder" color="green" :disabled="!this.table">{{showSummary ? "update" : "reorder"}}</v-btn>
                </v-col>
                <v-col cols="6">
                  <v-btn block @click="clear" color="red" >clear</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import ParseTable from "./plugins/ParseTable";
export default {
  name: "App",
  mounted() {
    this.$refs["ANI"].addEventListener("paste", (e) => {
      e.preventDefault();
      let pastedText = e.clipboardData.getData("text/html");
      let tableHTML = new DOMParser().parseFromString(pastedText, 'text/html').body.querySelector("b>div>table")
      this.ANI = ParseTable.convert(tableHTML)
      
      if (tableHTML && this.ANI) {
        this.$refs["ANI"].innerHTML = "";
        console.log("HTML 2:", tableHTML)
        this.$refs["ANI"].appendChild(tableHTML)
        this.table = tableHTML
      }
    });
  }, 
  data: () => ({
    table: false,
    ANI: "",
    showSummary: false,
    summary: "",
  }),
  methods: {
    reorder() {
      if (this.table) {
        this.ANI = ParseTable.convert(this.$refs["ANI"].querySelector("table"))
        console.log("ANI", this.ANI)
        ParseTable.toHTMLTable(this.ANI, this.$refs["ANI"].querySelector("table"))
        this.summary = this.createSummary()
        this.showSummary = true
      }
    },
    createSummary() {
      let summary = []
      summary.push("Affirmative Summary:<br>")
      summary.push("<ul>")
      let A = []
      Object.values(this.ANI.AC).forEach(e => {
        A.push(`<li>${e.item} (${e.symbol}): ${e.count}</li>`)
      })
      summary = [...summary, ...A]
      summary.push("</ul><br>")
      summary.push("Negative Summary:<br>")
      summary.push("<ul>")
      let N = []
      Object.values(this.ANI.NC).forEach(e => {
          N.push(`<li>${e.item} (${e.symbol}): ${e.count}</li>`)
      })
      summary = [...summary, ...N]
      summary.push("</ul>")
      return summary.join("")
    },

    updateANI(e) {
      console.log("UPDATE")
      if (!this.table) {
        e.target.innerHTML = ""
      } else {
        
      }
    },
    clear() {
      this.ANI = ""
      this.table = false
      this.showSummary = false
      this.$refs["ANI"].innerHTML = ""
    }
  }
};
</script>
<style>
#ANI {
  display: inline-block;
  min-width: 8in;
  min-height: 11.5in;
  overflow-x: visible;
  overflow-y: scroll;
  box-shadow: rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  outline: none;
  background-color: white;
  padding: 0.5in;
}
#ANI:empty::before {
  content: 'Paste your ANI Chart here';
}
#summary {
  display: inline-block;
  box-shadow: rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  outline: none;
  background-color: white;
  padding: 0.5in;
}
#ANI div {
  margin-left:0 !important
}
</style>
