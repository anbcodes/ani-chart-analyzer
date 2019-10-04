export default {
  convert(htmlTable) {
    let rows = Array.from(htmlTable.querySelector("tbody").children)

    let table = {}

    table.A = rows.map(r => ({
      number: r.children[0].innerText,
      symbol: r.children[1].innerText,
      item: r.children[2].innerText
    })).filter(r => r.symbol.trim() && r.item.trim())

    table.N = rows.map(r => ({
      number: r.children[0].innerText,
      symbol: r.children[3].innerText,
      item: r.children[4].innerText
    })).filter(r => r.symbol.trim() && r.item.trim())

    table.I = rows.map(r => ({
      number: r.children[0].innerText,
      symbol: r.children[5].innerText,
      item: r.children[6].innerText
    })).filter(r => r.item.trim())
    let foundSymbols = []
    table.AC = {}
    table.A.forEach((v) => {
      if (foundSymbols.indexOf(v.symbol) == -1) {
        foundSymbols.push(v.symbol)
        table.AC[v.symbol] = {item: v.item, symbol: v.symbol, count: 1}
      } else {
        table.AC[v.symbol].count += 1
      }
    })
    foundSymbols = []
    table.NC = {}
    table.N.forEach((v) => {
      if (foundSymbols.indexOf(v.symbol) == -1) {
        foundSymbols.push(v.symbol)
        table.NC[v.symbol] = {item: v.item, symbol: v.symbol, count: 1}
      } else {
        table.NC[v.symbol].count += 1
      }
    })
    let symbols = []
    symbols.push([...new Set(table.A.map(v => v.symbol))])
    symbols.push([...new Set(table.N.map(v => v.symbol))])
    symbols = [...new Set(symbols.flat())]

    table.SA = [...table.A]
    table.SA.sort((a, b) => symbols.indexOf(a.symbol) - symbols.indexOf(b.symbol))

    table.SN = [...table.N]
    table.SN.sort((a, b) => symbols.indexOf(a.symbol) - symbols.indexOf(b.symbol))

    table.SI = [...table.I]

    return table
  },
  toHTMLTable(ANITable, orginal) {
    let longer = ANITable.SA.length >= ANITable.SN.length ? "SA" : "SN"
    let shorter = longer === "SA" ? "SN" : "SA"
    // console.log(ANITable, longer, shorter, ANITable[longer], ANITable[shorter])
    let table = ANITable[longer].map((v, i) => ({
      [`${longer}Symbol`]: v.symbol, 
      [`${longer}Item`]: v.item, 
      [`${shorter}Symbol`]: ANITable[shorter][i] ? ANITable[shorter][i].symbol : "", 
      [`${shorter}Item`]: ANITable[shorter][i] ? ANITable[shorter][i].item : "", 
    }))
    Array.from(orginal.querySelector("tbody").children).some((e, i) => {
      // console.log(table.length, i, table[i])
      if (!i>0) return
      if (table.length === i-1) return true
      if (e.children[2].innerText.trim()) {
        e.children[1].children[0].children[0].innerText = table[i-1].SASymbol
        e.children[2].children[0].children[0].innerText = table[i-1].SAItem
      }
      if (e.children[4].innerText.trim()) {
        e.children[3].children[0].children[0].innerText = table[i-1].SNSymbol
        e.children[4].children[0].children[0].innerText = table[i-1].SNItem
      }
    })
  }
}