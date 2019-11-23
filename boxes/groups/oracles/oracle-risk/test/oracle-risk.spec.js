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

  const urlArgs = 'EOS:DAPP;0.5:0.5;0.95';

  it('Risk invalid url', done => {
    (async () => {
      try {
        var res = await testcontract.testget({
          uri: Buffer.from(`risk://win/lottery/`, 'utf8'),
          expectedfield: Buffer.from("error"),
        }, {
          authorization: `${code}@active`,
          broadcast: true,
          sign: true
        });
        done();
      }
      catch (e) {
        done(e);
      }
    })();
  });

  it('Risk invalid number of params', done => {
    (async () => {
      try {
        var res = await testcontract.testget({
          uri: Buffer.from(`risk://cvar/historical/a;b`, 'utf8'),
          expectedfield: Buffer.from("error"),
        }, {
          authorization: `${code}@active`,
          broadcast: true,
          sign: true
        });
        done();
      }
      catch (e) {
        done(e);
      }
    })();
  });

  it('Risk invalid number of symbols', done => {
    (async () => {
      try {
        var res = await testcontract.testget({
          uri: Buffer.from(`risk://cvar/historical/EOS:DAPP:IQ;0.5:0.5;0.95`, 'utf8'),
          expectedfield: Buffer.from("error"),
        }, {
          authorization: `${code}@active`,
          broadcast: true,
          sign: true
        });
        done();
      }
      catch (e) {
        done(e);
      }
    })();
  });

  it('Risk invalid number of weights', done => {
    (async () => {
      try {
        var res = await testcontract.testget({
          uri: Buffer.from(`risk://cvar/historical/EOS:DAPP;0.2:0.3:0.5;0.95`, 'utf8'),
          expectedfield: Buffer.from("error"),
        }, {
          authorization: `${code}@active`,
          broadcast: true,
          sign: true
        });
        done();
      }
      catch (e) {
        done(e);
      }
    })();
  });

  it('Risk invalid sum of weights', done => {
    (async () => {
      try {
        var res = await testcontract.testget({
          uri: Buffer.from(`risk://cvar/historical/EOS:DAPP;0.2:0.5;0.95`, 'utf8'),
          expectedfield: Buffer.from("error"),
        }, {
          authorization: `${code}@active`,
          broadcast: true,
          sign: true
        });
        done();
      }
      catch (e) {
        done(e);
      }
    })();
  });

  it('Risk invalid alphatest', done => {
    (async () => {
      try {
        var res = await testcontract.testget({
          uri: Buffer.from(`risk://cvar/historical/EOS:DAPP;0.5:0.5;2.95`, 'utf8'),
          expectedfield: Buffer.from("error"),
        }, {
          authorization: `${code}@active`,
          broadcast: true,
          sign: true
        });
        done();
      }
      catch (e) {
        done(e);
      }
    })();
  });

  it('Risk VaR Historical call', done => {
    (async () => {
      try {
        var res = await testcontract.testrnd({
          uri: Buffer.from(`risk://cvar/historical/${urlArgs}`, 'utf8'),
        }, {
          authorization: `${code}@active`,
          broadcast: true,
          sign: true
        });
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
          uri: Buffer.from(`risk://cvar/montecarlo/${urlArgs}`, 'utf8'),
        }, {
          authorization: `${code}@active`,
          broadcast: true,
          sign: true
        });
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
          uri: Buffer.from(`risk://cvar/varcov/${urlArgs}`, 'utf8'),
        }, {
          authorization: `${code}@active`,
          broadcast: true,
          sign: true
        });
        done();
      }
      catch (e) {
        done(e);
      }
    })();
  });

});
