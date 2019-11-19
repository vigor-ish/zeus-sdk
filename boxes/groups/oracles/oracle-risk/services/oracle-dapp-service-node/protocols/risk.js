let riskjs;

module.exports = async({ proto, address }) => {
  // risk://algo/func/arg;arg;...
  if (!riskjs)
    riskjs = require("riskjs")();

  return new Promise((resolve, reject) => {
    const fen = address;
    // console.log("address", address);
    riskjs.onmessage = function onmessage(event) {
      if (!event)
        return;
      console.log(event);
      const parts = event.split(' ');
      let idx = 0;
      const cmd = parts[idx++];
      if (cmd == 'bestmove') {
        const move = parts[idx++];
        console.log('moveObj', move);
        resolve(Buffer.from(move));
      }



    };
    riskjs.postMessage(`uci`);
    riskjs.postMessage(`position fen ${fen}`);
    riskjs.postMessage(`go depth 10`);
  });
};
