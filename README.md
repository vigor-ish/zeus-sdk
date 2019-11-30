# LiquidRisk

by VIGORish team to the DAPP Network Global Hackathon 2019

### Check our submission on branch `vigorish`

Our code is in this repository under the branch [vigorish](https://github.com/vigorstablecoin/liquid-risk/tree/vigorish) and you can then move to the folder [/boxes/groups/vigorish/](https://github.com/vigorstablecoin/liquid-risk/tree/vigorish/boxes/groups/vigorish) to check out our work.

### Installation

- First you need to deploy our dapp with the zeus toolbox
```bash
$ zeus deploy box
```
on all the boxes in that folder

- Unbox `risk-app` on your development directory
```bash
$ zeus unbox risk-dapp
```

- Then migrate the unboxed boxes to your local test net
```bash
$ zeus migrate
```

- There are also some unit tests available
```bash
$ zeus test
```

- And to launch the frontend
```bash
$ zeus run frontend main
```

Enjoy! :)

### RiskJS dependency

As part of our submission the project [riskjs](https://github.com/vigorstablecoin/riskjs) is a central part, as we also developed the JS port, using node-gyp native integration to port the VaR C++ code from Calvin to run on NodeJS. This is also a deliverable from our team and a project to the opensource comunity published to NPMjs [riskjs](https://www.npmjs.com/package/riskjs).


### Built with:

```            
  ____   ___   _   _   ___ 
 |_  /  / _ \ | | | | / __|
  / /  |  __/ | |_| | \__ \
 /___|  \___|  \__,_| |___/  SDK
            
```

Visit https://docs.liquidapps.io

[![Documentation Status](https://readthedocs.org/projects/liquidapps/badge/?version=stable)](https://docs.liquidapps.io)

Zeus

[![npm version](https://badge.fury.io/js/%40liquidapps%2Fzeus-cmd.svg)](https://badge.fury.io/js/%40liquidapps%2Fzeus-cmd)

DSP: 

[![npm version](https://badge.fury.io/js/%40liquidapps%2Fdsp.svg)](https://badge.fury.io/js/%40liquidapps%2Fdsp)

[![](https://images.microbadger.com/badges/version/liquidapps/zeus-dsp-bootstrap.svg)](https://hub.docker.com/r/liquidapps)

[![](https://images.microbadger.com/badges/image/liquidapps/eosio-dsp:v1.3-latest.svg)](https://hub.docker.com/r/liquidapps/eosio-dsp)
