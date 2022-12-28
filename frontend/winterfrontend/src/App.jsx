
import './App.css';
import { Route, Routes } from 'react-router-dom';
import AllBondsPage from './pages/AllBonds';
import NewBondPage from './pages/NewBond';
import TransferBondPage from './pages/TransferBond';
import WithdrawBondPage from './pages/WithdrawBond';
import RefundBondPage from './pages/RefundBondHtlc';
import BondHtlcRequestPage from './pages/BondHtlcRequest';
import GetHtlcPage from './pages/GetHtlc';
import Homepage from './pages/Homepage';
import Navigation from './components/Navigation';
import Web3 from 'web3';
import { useEffect, useState } from 'react';

function App() {
  // const [account, setAccount] = useState();

  // useEffect(() => {
  //   async function load() {
  //     const web3 = new Web3(Web3.givenProvider || `http://localhost:7545`);
  //     const accounts = await web3.eth.requestAccounts();

  //     setAccount(accounts[0]);
  //   }

  //   load();;

  // }, [])

  const [isConnected, setIsConnected] = useState(false);
  const [ethBalance, setEthBalance] = useState("");

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

  const onConnect = async () => {
    try {
      const currentProvider = detectCurrentProvider();

      if (currentProvider) {
        await currentProvider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(currentProvider);
        const userAccounts = await web3.eth.getAccounts();
        const account = userAccounts[0];
        let ethBalance = await web3.eth.getBalance(account);
        setEthBalance(ethBalance);
        setIsConnected(true);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Navigation />
      {!isConnected ?
        <div style={{ marginTop: '1rem', marginLeft: '1rem' }}>
          <button style={{ width: '5rem', height: '2rem' }} onClick={onConnect}>Login</button>
        </div>
        :
        <div style={{ marginTop: '1rem', marginLeft: '1rem' }}>
          <h2 style={{color: 'green'}}>You are connected to metamask</h2>
          <span>Your Balance: {ethBalance} wei</span>
        </div>
      }


      <Routes>
        <Route path="/all-bonds" element={<AllBondsPage />} />
        <Route path="/new-bond" element={<NewBondPage />} />
        <Route path="/transfer-bond" element={<TransferBondPage />} />
        <Route path="/withdraw-bond" element={<WithdrawBondPage />} />
        <Route path="/refund-bond" element={<RefundBondPage />} />
        <Route path="/bond-htlc" element={<BondHtlcRequestPage />} />
        <Route path="/get-htlc" element={<GetHtlcPage />} />
        <Route path="/" element={<Homepage />} />
      </Routes>
    </>
  );
}

export default App;
