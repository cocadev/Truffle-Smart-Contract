import React, { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import MessageStorageContract from "./contracts/MessageStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

const getContract = ({ contract }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = contract.networks[networkId];
      const instance = new web3.eth.Contract(
        contract.abi,
        deployedNetwork && deployedNetwork.address
      );
      resolve({ web3, instance, accounts });
    } catch (e) {
      reject(e);
    }
  });
};

const App = () => {
  const ref = useRef();
  const [state, setState] = useState({
    pending: false,
    editing: false,
    localValue: null,
    storageValue: null,
    web3: null,
    accounts: null,
    contract: null,
  });

  // read
  const readStorage = async () => {
    const { contract } = state;

    setState({ ...state, pending: true });
    if (!contract) return false;
    const response = await contract.methods.read().call();
    // Update local state with the result
    setState({
      ...state,
      pending: false,
      editing: false,
      storageValue: response,
    });
  };

  // write
  const updateStorage = async () => {
    const { accounts, contract } = state;
    setState({ ...state, pending: true });
    if (!contract) return false;

    const transaction = await contract.methods
      .write(state.localValue)
      .send({ from: accounts[0] });

    // Update local state with the result
    if (transaction.status) {
      setState({ ...state, pending: false });
      readStorage();
    }
  };

  useEffect(() => {
    getContract({ contract: MessageStorageContract })
      .then(({ web3, instance, accounts }) => {
        setState({ ...state, web3, accounts, contract: instance });
      })
      .catch(console.error);
  }, []);

  const handleOnClick = () => setState({ ...state, editing: !state.editing });

  const handleOnChange = (e) =>
    setState({ ...state, localValue: e.target.value });

  const handleOnSubmit = (e) => {
    if (!state.localValue) {
      return false;
    }
    e.preventDefault();
    updateStorage();
    ref.current.value = null;
  };
  useEffect(() => {
    readStorage();
  }, [state.contract]);

  if (!state.web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <div className="App">
      <h1>Your Truffle Box is installed and ready</h1>
      <img src={logo} className="App-logo" alt="logo" />

      <p>click on message below to edit</p>

      {state.pending && <p className="App-pending">Transaction pending ...</p>}
      {state.editing ? (
        Boolean(state.editing && !state.pending) && (
          <form onSubmit={handleOnSubmit}>
            <input
              ref={ref}
              type="text"
              name="message"
              onChange={handleOnChange}
            />
          </form>
        )
      ) : (
        <p className="App-message" onClick={handleOnClick}>
          {state.storageValue}
        </p>
      )}
    </div>
  );
};
export default App;
