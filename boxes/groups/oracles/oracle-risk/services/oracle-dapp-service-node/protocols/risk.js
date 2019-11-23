const logger = require('../../../extensions/helpers/logger');
const { getPrices } = require('../get_prices')
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

  return new Promise(async (resolve, reject) => {
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
    logger.info('Symbols ' + symbols)
    const weights = args[1].split(':');
    logger.info('weights ' + weights)
    const alphatest = args[2];
    logger.info('alphatest ' + alphatest)

    // Require the number of symbols/weights to be 2 for now
    // TODO: Remove in the future after getting getPrices to any number of symbols
    if (symbols.length != 2 || weights.length != 2) {
      logger.error('invalid number of symbols/weights: expected 2/2 and got ' + symbols.length + '/' + weights.length);
      resolve(Buffer.from('error'));
      return;
    }

    // Verify the weights sum to 1
    const totalWeight = weights.reduce((s, n) => s + n, 0);
    if (totalWeight != 1) {
      logger.error('invalid weight distribution: expected sum to be 1 and got ' + totalWeight);
      resolve(Buffer.from('error'));
      return;
    }

    // Verify alphatest is a number between 0 and 1
    if (alphatest < 0 || alphatest > 1) {
      logger.error('invalid alphatest: expected 0..1 and got ' + totalWeight);
      resolve(Buffer.from('error'));
      return;
    }

    // Get the price feeds
    // TODO: Make the routine work with any number of symbols
    // logger.info('Getting prices')
    const data = await getPrices(symbols[0], symbols[1]);
    // logger.info('price data ' + data)

    try {
      // Call the RiskJS lib
      const result = riskjs[riskCalc](data, weights, alphatest);
      logger.info('VaR is ' + result)
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
