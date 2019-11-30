import React, { Component } from 'react';
import { Api, JsonRpc, RpcError } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';      // development only

// material-ui dependencies
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';

// const theme = createMuiTheme({
  // palette: {
  //   type: 'dark',
  // },
// });


// set up styling classes using material-ui "withStyles"
const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  formButton: {
    marginTop: theme.spacing.unit,
    width: "100%",
  },
  pre: {
    // background: "#eee",
    padding: 4,
    marginBottom: 0.
  },
  formControl: {
    margin: 10,
    minWidth: 120,
  }
});

// Index component
class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      method: 'montecarlo',
      symbolA: 'EOS',
      symbolB: 'DAPP',
      weightA: 0.5,
      weightB: 0.5,
      alphatest: 0.95,
      response: ''
    };
    this.state.uri = this.calcUri(this.state);
  }


  componentDidMount() {
  }

  handleChangeMethod(event) {
    let state = {
      ...this.state,
      method: event.target.value
    };
    this.handleChanges(state);
  }

  handleChangeSymbolA(event) {
    let state = {
      ...this.state,
      symbolA: event.target.value
    };
    this.handleChanges(state);
  }

  handleChangeSymbolB(event) {
    let state = {
      ...this.state,
      symbolB: event.target.value
    };
    this.handleChanges(state);
  }

  handleChangeWeightA(event) {
    let state = {
      ...this.state,
      weightA: event.target.value,
      weightB: 1 - event.target.value
    };
    this.handleChanges(state);
  }

  handleChanges(state) {
    let uri = this.calcUri(state);
    this.setState({
      ...state,
      uri
    })
  }

  calcUri(state) {
    return `risk://cvar/${state.method}/${state.symbolA}:${state.symbolB};${state.weightA}:${state.weightB};${state.alphatest}`;
  }

  callOracle() {
    const { uri } = this.state;

    this.sendAction(1, uri);
  }

  // Main action call to blockchain
  async sendAction(id, uri) {
    const defaultPrivateKey = '5JtUScZK2XEp3g9gh7F8bwtPTRAkASmNrrftmx4AxDKD5K4zDnr'; //some key
    const account = 'test1';
    const action = 'getrisk';

    const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);
    const rpc = new JsonRpc('http://127.0.0.1:13015');
    const api = new Api({ rpc, signatureProvider });

    this.waitForResponse(id);

    // Main call to blockchain
    try {
      const result = await api.transact({
        actions: [{
          account,
          name: action,
          authorization: [],
          data: {
            id,
            uri
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
      console.dir(result);

    }
    catch (err) {
      console.log(err);
    }
  }

  waitForResponse(id) {
    let state = {
      ...this.state,
      loading: true
    }
    this.setState(state);
  }

  render() {
    const { loading, response, uri, method, symbolA, symbolB, weightA, weightB, alphatest } = this.state;
    const result = (
      <TextField
        disabled
        id="outlined-disabled"
        label="CVar Result"
        value={response}
        margin="normal"
        variant="outlined"
      />
    );
    const loader = loading ? <img src="loader.svg"/> : result

    return (
      // <MuiThemeProvider theme={theme}>
        <div style={{height: "100%", width: "100%"}}>
          <AppBar position="static" style={{background:"#dddddd"}} >
            <Toolbar>
              <div style={{"display": "flex", "alignItems":"center"}} >
                <img alt='logo' src="vigor.jpg" width="64" height="64"/>
                <Typography variant="title" color="inherit">
                  <div style={{"marginLeft":"15px", color:"black"}}>liquidRisk CVaR Calculation DAPP</div>
                </Typography>
              </div>
            </Toolbar>
          </AppBar>

          <br/>

          <form noValidate autoComplete="off">
            <FormControl className={'formControl'}>
              <InputLabel id="demo-simple-select-helper-label">CVaR Method</InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={method}
                onChange={this.handleChangeMethod.bind(this)}
              >
                <MenuItem value={'historical'}>Historical</MenuItem>
                <MenuItem value={'montecarlo'}>Monte Carlo</MenuItem>
                <MenuItem value={'varcov'}>Variance Covariance</MenuItem>
              </Select>
              <FormHelperText>Select one of the available tokens</FormHelperText>
            </FormControl>
            <br /><br />
            <FormControl className={'formControl'}>
              <InputLabel id="demo-simple-select-helper-label">Symbol A</InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={symbolA}
                onChange={this.handleChangeSymbolA.bind(this)}
              >
                <MenuItem value={'EOS'}>EOS</MenuItem>
                <MenuItem value={'CAN'}>CAN</MenuItem>
                <MenuItem value={'DAPP'}>DAPP</MenuItem>
                <MenuItem value={'DICE'}>DICE</MenuItem>
                <MenuItem value={'NUT'}>NUT</MenuItem>
                <MenuItem value={'BNT'}>BNT</MenuItem>
                <MenuItem value={'EOSDAC'}>EOSDAC</MenuItem>
                <MenuItem value={'MEETONE'}>MEETONE</MenuItem>
              </Select>
              <FormHelperText>Select one of the available tokens</FormHelperText>
            </FormControl>
            <TextField id="standard-basic" label="Weight A" value={weightA} onChange={this.handleChangeWeightA.bind(this)} />
            <br /><br />
            <FormControl className={'formControl'}>
              <InputLabel id="demo-simple-select-helper-label">Symbol B</InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={symbolB}
                onChange={this.handleChangeSymbolB.bind(this)}
              >
                <MenuItem value={'EOS'}>EOS</MenuItem>
                <MenuItem value={'CAN'}>CAN</MenuItem>
                <MenuItem value={'DAPP'}>DAPP</MenuItem>
                <MenuItem value={'DICE'}>DICE</MenuItem>
                <MenuItem value={'NUT'}>NUT</MenuItem>
                <MenuItem value={'BNT'}>BNT</MenuItem>
                <MenuItem value={'EOSDAC'}>EOSDAC</MenuItem>
                <MenuItem value={'MEETONE'}>MEETONE</MenuItem>
              </Select>
              <FormHelperText>Select one of the available tokens</FormHelperText>
            </FormControl>
            <TextField id="standard-basic" label="Weight B" value={weightB} disabled />
            <br /><br />
            <TextField id="standard-basic" label="Alpha Test" value={alphatest} />
          </form>
          <br /><br />
          <Typography variant="title" color="inherit">
            Oracle URI: {uri}
          </Typography>
          <br /><br />
          <Button variant="contained" onClick={this.callOracle.bind(this)} disabled={loading}>Calculate CVaR</Button>
          <br /><br />
          {loader}
        </div>
      // </MuiThemeProvider>
    );
  }

}

export default withStyles(styles)(Index);
