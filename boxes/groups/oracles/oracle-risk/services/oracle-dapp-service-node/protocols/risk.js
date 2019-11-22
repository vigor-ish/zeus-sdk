const logger = require('../../../extensions/helpers/logger');

let riskjs;

// Algorithms
const ALGORITHM_CVAR = 'cvar';

// CVaR Methods
const CVAR_METHODS = {
  montecarlo: 'portfolioMonteCarloVaR',
  varcov: undefined     // not implemented yet
}

module.exports = async ({ proto, address }) => {
  // risk://algorithm/method/arg;arg;...
  if (!riskjs)
    riskjs = require("riskjs");

  // Parse the address
  const [algorithm, method, rest] = address.split('/');
  const args = rest.split(';');
  // TODO: parse parameters

  return new Promise((resolve, reject) => {
    console.log("address", address);

    // TODO: Get price data
    const data = [];

    // Select the algorithm function
    const riskCalc = riskCalcFunction(algorithm, method);
    if (riskCalc === undefined) {
      logger.error('invalid algorithm/method pair: ' + algorithm + '/' + method);
      resolve(Buffer.from('error'));
      return;
    }

    // TODO: what to do with the args (parameters)?

    try {
      // Call the RiskJS lib
      const result = riskjs[riskCalc](data);

      resolve(Buffer.from(result));
    }
    catch (e) {
      logger.error('calculation failed, reason: ' + e.message);
      resolve(Buffer.from('error'));
    }
  });
};

// Helpers

// Returns the correct RiskJS function to call based on the definitions in the
// constants at the top
function riskCalcFunction(algorithm, method) {
  switch (algorithm) {
    case ALGORITHM_CVAR:
      return CVAR_METHODS[method];
  }

  return undefined;
}
