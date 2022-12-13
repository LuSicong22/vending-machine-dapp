import Head from "next/head";
import "bulma/css/bulma.css";
import styles from "../styles/VendingMachine.module.css";
import Web3 from "web3";

const VendingMachine = () => {
  let web3;
  //window.ethereum
  const connectWalletHandler = async () => {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        web3 = new Web3(window.ethereum);
      } catch (err) {
        console.log(err.message);
      }
    } else {
      // metamask not installed
      console.log("Please install MetaMask!");
    }
  };

  return (
    <div className={styles.main}>
      <Head>
        <title>VendingMachine App</title>
        <meta name="description" content="A blockchain vending machine app" />
      </Head>
      <nav className="navbar mt-4 mb-4">
        <div className="container">
          <div className="navbar-brand">
            <h1>Vending Machine</h1>
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
          <p>placeholder text</p>
        </div>
      </section>
    </div>
  );
};

export default VendingMachine;
