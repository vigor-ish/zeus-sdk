const logger = require('../../../extensions/helpers/logger');

let riskjs;

// Algorithms
const ALGORITHM_CVAR = 'cvar';

// CVaR Methods
const CVAR_METHODS = {
  historical: undefined,    // not implemented yet
  montecarlo: 'portfolioMonteCarloVaR',
  varcov:     undefined     // not implemented yet
}

module.exports = async ({ proto, address }) => {
  // risk://algorithm/method/arg;arg;...
  if (!riskjs)
    riskjs = require("riskjs");

  // Parse the address
  const [algorithm, method, rest] = address.split('/');
  const args = rest.split(';');

  return new Promise((resolve, reject) => {
    console.log("address", address);

    // Select the algorithm function
    const riskCalc = riskCalcFunction(algorithm, method);
    if (riskCalc === undefined) {
      logger.error('invalid algorithm/method pair: ' + algorithm + '/' + method);
      resolve(Buffer.from('error'));
      return;
    }

    // Check the correct number of arguments has been passed
    if (args.length != 3) {
      logger.error('invalid number of parameters: expected 3 and got ' + args.length);
      resolve(Buffer.from('error'));
      return;
    }

    // Parse parameters
    const symbols = args[0].split(':');
    const weights = args[1].split(':');
    const alphatest = args[2];

    // TODO: Get price data
    const data = [];

    try {
      // Call the RiskJS lib
      const result = riskjs[riskCalc](data);    // TODO: pass other parameters?

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
