require("babel-core/register");
require("babel-polyfill");
import 'mocha';
const { assert } = require('chai'); // Using Assert style
const { getTestContract } = require('../extensions/tools/eos/utils');

const artifacts = require('../extensions/tools/eos/artifacts');
const deployer = require('../extensions/tools/eos/deployer');
const { genAllocateDAPPTokens } = require('../extensions/tools/eos/dapp-services');

var contractCode = 'oracleconsumer';
var ctrt = artifacts.require(`./${contractCode}/`);

describe(`Risk Oracle Service Test`, () => {
  var testcontract;
  const code = 'test1';
  before(done => {
    (async () => {
      try {
        var deployedContract = await deployer.deploy(ctrt, code);
        await genAllocateDAPPTokens(deployedContract, "oracle", "pprovider1", "default");
        await genAllocateDAPPTokens(deployedContract, "oracle", "pprovider2", "foobar");

        testcontract = await getTestContract(code);
        done();
      }
      catch (e) {
        done(e);
      }
    })();
  });

  var account = code;

  it('Risk invalid url', done => {
    (async () => {
      try {
        var res = await testcontract.testrnd({
          uri: Buffer.from(`risk://win/lottery/`, 'utf8'),
        }, {
          authorization: `${code}@active`,
          broadcast: true,
          sign: true
        });
        //assert.equal();
        console.log(res);
        done();
      }
      catch (e) {
        done(e);
      }
    })();
  });

  it('Risk VaR Monte Carlo call', done => {
    (async () => {
      try {
        var res = await testcontract.testrnd({
          uri: Buffer.from(`risk://cvar/montecarlo/`, 'utf8'),
        }, {
          authorization: `${code}@active`,
          broadcast: true,
          sign: true
        });
        //assert.equal();
        console.log(res);
        done();
      }
      catch (e) {
        done(e);
      }
    })();
  });

  it('Risk VaR Variance Covariance call', done => {
    (async () => {
      try {
        var res = await testcontract.testrnd({
          uri: Buffer.from(`risk://cvar/varcov/`, 'utf8'),
        }, {
          authorization: `${code}@active`,
          broadcast: true,
          sign: true
        });
        //assert.equal();
        console.log(res);
        done();
      }
      catch (e) {
        done(e);
      }
    })();
  });

});
