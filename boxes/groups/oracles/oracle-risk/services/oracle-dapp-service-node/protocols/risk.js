let riskjs;

// Algorithms
const ALGORITHM_CVAR = 'cvar';

// CVaR Methods
const CVAR_METHODS = {
  montecarlo: RiskJS.portfolioMonteCarloVaR,
  varcov: () => 'not implemented yet'
}

module.exports = async ({ proto, address }) => {
  // risk://algorithm/method/arg;arg;...
  if (!riskjs)
    riskjs = require("riskjs")();

  // Parse the address
  const [algorithm, method, rest] = address.split('/');
  const args = rest.split(';');

  return new Promise((resolve, reject) => {
    console.log("address", address);

    // Get price data
    const data = [];

    // Select the algorithm function
    const riskCalc = riskCalcFunction(algorithm, method);
    if (result === undefined) {
      reject('invalid algorithm/method pair: ' + algorithm + '/' + method);
      return;
    }

    // TODO: what to do with the args (parameters)?

    try {
      // Call the RiskJS lib
      const result = riskCalc(data);

      resolve(Buffer.from(result));
    }
    catch (e) {
      reject('calculation failed, reason: ' + e.message);
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
