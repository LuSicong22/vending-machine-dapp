import Head from "next/head";
import "bulma/css/bulma.css";
import styles from "../styles/VendingMachine.module.css";
import VendingMachineContract from "../blockchain/vending";
import Web3 from "web3";
import { useEffect, useState } from "react";

const VendingMachine = () => {
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [inventory, setInventory] = useState("");
  const [myDonutCount, setMyDonutCount] = useState("");
  const [buyCount, setBuyCount] = useState("");
  const [web3, setWeb3] = useState(null);
  const [address, setAddress] = useState(null);
  const [vmContract, setVmContract] = useState(null);
  const [purchases, setPurchases] = useState(0);

  useEffect(() => {
    if (vmContract) getInventoryHandler();
    if (vmContract && address) getMyDonutCountHandler();
  }, [vmContract, address, purchases]);

  const getInventoryHandler = async () => {
    const inventory = await vmContract.methods
      .getVendingMachineBalance()
      .call();
    setInventory(inventory);
  };

  const getMyDonutCountHandler = async () => {
    const count = await vmContract.methods.donutBalances(address).call();
    setMyDonutCount(count);
  };

  const updateDonutQty = (event) => {
    setBuyCount(event.target.value);
  };

  const buyDonutHandler = async () => {
    try {
      await vmContract.methods.purchase(buyCount).send({
        from: address,
        value: web3.utils.toWei("0.001", "ether") * buyCount,
      });
      setPurchases(purchases + 1);
      setSuccessMsg(`${buyCount} donuts purchased!`);
    } catch (err) {
      setError(err.message);
    }
  };

  const connectWalletHandler = async () => {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);
        const accounts = await web3.eth.getAccounts();
        setAddress(accounts[0]);

        const vm = VendingMachineContract(web3);
        setVmContract(vm);
      } catch (err) {
        setError(err.message);
      }
    } else {
      // metamask not installed
      console.log("Please install MetaMask!");
    }
  };

  return (
    <div className={styles.main}>
      <Head>
        <title>Vending Machine Dapp</title>
        <meta name="description" content="A blockchain vending machine app" />
      </Head>
      <nav className="navbar mt-4 mb-4">
        <div className="container">
          <div className="navbar-brand">
            <h1>Vending Machine Dapp</h1>
          </div>
          <div className="navbar-end">
            <button
              onClick={connectWalletHandler}
              className="button is-primary"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </nav>
      <section>
        <div className="container">
          <h2>Vending machine inventory: {inventory}</h2>
        </div>
      </section>
      <section>
        <div className="container">
          <h2>My donuts: {myDonutCount}</h2>
        </div>
      </section>
      <section className="mt-5">
        <div className="container">
          <div className="field">
            <label className="label">Buy donuts</label>
            <div className="control">
              <input
                onChange={updateDonutQty}
                type="text"
                className="input"
                placeholder="Enter amount..."
              />
            </div>
            <button
              onClick={buyDonutHandler}
              className="button is-primary mt-2"
            >
              Buy
            </button>
          </div>
        </div>
      </section>
      <section className="mt-2">
        <div className="container has-text-danger">
          <p>{error}</p>
        </div>
      </section>
      <section className="mt-2">
        <div className="container has-text-success">
          <p>{successMsg}</p>
        </div>
      </section>
    </div>
  );
};

export default VendingMachine;
