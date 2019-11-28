// this is to support both browser and node
var SDK = typeof window !== 'undefined' ? window.COIN_API_SDK : require("./coinapi_v1")["default"]
var sdk = new SDK("98FB8CF7-6FB2-406F-A793-012FAD2A2E2B")

const getPrices = async function (tokenA, tokenB) {
  let now = new Date(); // current time and date
  let lastYear = new Date() // temporary initialization of our last year's date
  var oneYrAgo = lastYear.getFullYear() - 1 // get last year's actual year
  lastYear.setFullYear(oneYrAgo); // set last year's year to the correct actual year

  var res = [ // THIS IS OUR MAIN OUTPUT, we are updating it as we make requests and writing it to a file at the end
    ["Date", tokenA, tokenB] // this is our csv header
  ]
  // first we get last year's BTC / USD daily closing prices
  var rates = await sdk.ohlcv_historic_data('BTC', "1DAY", lastYear, now, 365).then( function (Ohlcv_historic_data) {
    var tmp = []
    
    Ohlcv_historic_data.forEach(x => {
      tmp.push([x.time_period_end.toISOString().split("T")[0], x.price_close]) // we record the day as well as the closing price
    })
    return tmp
  });
  let tmp = await sdk.ohlcv_historic_data(tokenA, "1DAY", lastYear, now, 365).then( function (Ohlcv_historic_data) { // now we get daily close for token A param
    var tmp = res // initialize with our header from before
    let index = 0
    let firstIndex = 0
  
    while (rates[index][0] !== Ohlcv_historic_data[0].time_period_end.toISOString().split("T")[0]) // find the first BTC price tick that we need
      index++ // we only increment the BTC ticks index because we know for sure we have data for BTC going back 1 year ago from today
    firstIndex = index // remember our first matching day between tokenA/BTC and BTC/USD

    Ohlcv_historic_data.forEach(x => {
      tmp.push([x.time_period_end.toISOString().split("T")[0], x.price_close * rates[index][1], 0.0]) 
      index++ // move to the next BTC price tick
    })
    return [firstIndex, tmp]
  });
  let index = tmp[0]
  res = tmp[1]
  res = await sdk.ohlcv_historic_data(tokenB, "1DAY", lastYear, now, 365).then( function (Ohlcv_historic_data) {
    var result = res
    var prepend = [res[0]]

    var indexA = 1
    var indexBTC = index

    var BindexBTC = 0
    while (rates[BindexBTC][0] !== Ohlcv_historic_data[0].time_period_end.toISOString().split("T")[0]) // find the first BTC price tick that matches token B
      BindexBTC++
    
    let lengthA = result.length - 1 
    let partsA = result[indexA][0].split('-') // the first day we have for token A in parts
    
    Ohlcv_historic_data.forEach(x => {
      let day = x.time_period_end.toISOString().split("T")[0]
      let partsB = day.split('-')
      
      if ( new Date(partsA[0], partsA[1], partsA[2]) > new Date(partsB[0], partsB[1], partsB[2]) ) { // if tick came before our most recent tick for token A
        prepend.push([day, 0.0, x.price_close * rates[BindexBTC][1]])
        BindexBTC++
      }
      else {
        while (indexA < lengthA && result[indexA][0] !== day) { // find the first date that matches in token A's ticks
          indexA++
          indexBTC++ // we need to increment our index in BTC as we also increment our index in A
        }
        if (indexA > lengthA) { // if we went through all the ticks and didn't find one matching day just append to the end
          result.push([day, 0.0, x.price_close * rates[indexBTC][1]])
          indexBTC++
        }
        else { // we found a matching tick so we can add to the row
          result[indexA][2] = x.price_close * rates[indexBTC][1] // add B's price to the row for this day, coming after A's price
          indexA++
          indexBTC++
        }
      }
    })
    return prepend.concat(result.slice(1))
  });
  
  return res
}
module.exports = { getPrices }