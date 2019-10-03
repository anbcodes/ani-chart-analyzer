<template>
  <v-app>
    <v-app-bar app hide-on-scroll>
      <v-toolbar-title><span class="display-1">Google Docs ANI Chart Analyzer</span></v-toolbar-title>
      <v-spacer />
      <v-btn icon>
        <v-icon>home</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container>
        <v-row justify="center">
          <div>
            <div id="ANI" ref="ANI" contenteditable="true" @input="updateANI">paste table here</div>
            <v-container>
              <v-row>
                <v-col cols="6">
                  <v-btn block @click="reorder" color="green">reorder</v-btn>
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
      
      if (tableHTML) {
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
  }),
  methods: {
    reorder() {
      ParseTable.toHTMLTable(this.ANI, this.$refs["ANI"].querySelector("table"))
    },
    updateANI() {
      if (!this.table) {
        e.target.innerHTML = "paste table here"
      } else {
        this.ANI = ParseTable.convert(this.$refs["ANI"].innerHTML)
      }
    },
    clear() {
      this.ANI = ""
      this.table = false
      this.$refs["ANI"].innerHTML = "paste table here"
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
#ANI div {
  margin-left:0 !important
}
</style>
