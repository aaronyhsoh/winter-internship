
import './App.css';
import { Route, Routes } from 'react-router-dom';
import AllBondsPage from './pages/AllBonds';
import NewBondPage from './pages/NewBond';
import TransferBondPage from './pages/TransferBond';
import WithdrawBondPage from './pages/Htlc/WithdrawBond';
import RefundBondPage from './pages/Htlc/RefundBondHtlc';
import BondHtlcRequestPage from './pages/Htlc/BondHtlcRequest';
import GetHtlcPage from './pages/Htlc/GetHtlc';
import BondByIdPage from './pages/BondByIdRequest';
import Homepage from './pages/Homepage';
import Navigation from './components/Navigation';
//import GetBondByIdPage from './pages/GetBondById';
import GetHtlcByIdReqPage from './pages/Htlc/GetHtlcByIdReq';
import Web3 from 'web3';
import { useState } from 'react';
import HtlcContract from "./HtlcBond.json";
import 'antd/dist/reset.css';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [ethBalance, setEthBalance] = useState("");
  const [htlcContractBalance, setHtlcContractBalance] = useState(-1);
  const [account, setAccount] = useState("");
  const [htlcContract, setHtlcContract] = useState();


  const detectCurrentProvider = () => {
    let provider;

    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      console.log("Non-ethereum browser detected. You should install MetaMask");
    }

    return provider;
  }

  // connect to metamask
  const onConnect = async () => {
    try {
      const currentProvider = detectCurrentProvider();

      if (currentProvider) {
        await currentProvider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(currentProvider);
        const userAccounts = await web3.eth.getAccounts();
        const account = userAccounts[0];
        let ethBalance = await web3.eth.getBalance(account);
        setAccount(account);
        setEthBalance(ethBalance);
        setIsConnected(true);

        // get contract
        const networkId = await web3.eth.net.getId();
        setHtlcContract(new web3.eth.Contract(HtlcContract.abi, HtlcContract.networks[networkId].address));
      }
    } catch (err) {
      console.log(err);
    }
  }

  const getHtlcContractBalance = async () => {
    let bal = await htlcContract.methods.getContractBalance().call({from: account}).then(result => result).catch(err => console.log(err));
    setHtlcContractBalance(bal);
  }

  const createHtlc = async () => {
    // createHtlc parameters to be inputted by users
    let result = await htlcContract.methods.createHtlc(account, "0x65462b0520ef7d3df61b9992ed3bea0c56ead753be7c8b3614e0ce01e4cac41b", 100000000).send({from: account, value: 9932620000000000})
    .then(result  => {
      console.log(result.events.returnValues[0]);
      return (result)}
      )
    .catch(err => console.log(err.message));
  }

  const refundHtlc = async () => {
    let result = await htlcContract.methods.refund().send({from: account}).then(tx => tx).catch(err => console.log(err));
    console.log(result);
  }

  const withdrawHtlc = async () => {
    // secret to be inputted by user
    let result = await htlcContract.methods.withdraw('secret').send({from: account}).then(tx => tx).catch(err => console.log(err));
    console.log(result);
  }

  const getPendingPartyToWithdraw = async () => {
    let party = await htlcContract.methods.pendingPartyToWithdraw().call({from: account}).then(result => result).catch(err => console.log(err));
    console.log(party);
  }

  const getPendingReceiveFrom = async () => {
    let party = await htlcContract.methods.pendingReceiveFrom().call({from: account}).then(result => result).catch(err => console.log(err));
    console.log(party);
  }

  return (
    <>
      {/* {!isConnected ?
        <div style={{ marginTop: '1rem', marginLeft: '1rem' }}>
          <button style={{ width: '5rem', height: '2rem' }} onClick={onConnect}>Login</button>
        </div>
        :
        <div style={{ marginTop: '1rem', marginLeft: '1rem' }}>
          <h2 style={{color: 'green'}}>You are connected to metamask</h2>
          <div>
          <span>Your Balance: {ethBalance} wei </span>
          </div>
          <span>Htlc Contract Balance: {htlcContractBalance}</span>
          <br/>
          <button onClick={getHtlcContractBalance}>Get Contract Balance</button>

          <button onClick={createHtlc}>Create Htlc</button>

          <button onClick={refundHtlc}>Refund Htlc</button>

          <button onClick={withdrawHtlc}>Withdraw Htlc</button>

          <button onClick={getPendingPartyToWithdraw}>Pending Withdrawal From: </button>

          <button onClick={getPendingReceiveFrom}>Pending Receive From:</button>

        </div>
      } */}
      
    <Routes>
      <Route path="/all-bonds" element={<AllBondsPage />} />
      <Route path="/bond-by-id" element={<BondByIdPage />} />
      <Route path="/new-bond" element={<NewBondPage />} />
      <Route path="/transfer-bond" element={<TransferBondPage />} />
      <Route path="/withdraw-bond" element={<WithdrawBondPage />} />
      <Route path="/refund-bond" element={<RefundBondPage />} />
      <Route path="/bond-htlc" element={<BondHtlcRequestPage />} />
      <Route path="/get-htlc" element={<GetHtlcPage />} />
      <Route path="/get-htlc-by-id" element={<GetHtlcByIdReqPage />} />
      {/* <Route path="/get-bond-by-id" element={<GetBondByIdPage/> } /> */}
      <Route path="/" element={<Homepage />} />
    </Routes>
  </>
  );
}

export default App;
