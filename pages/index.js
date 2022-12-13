import Head from "next/head";
import styles from "../styles/Home.module.css";
import VendingMachine from "./vending-machine";

export default function Home() {
  return (
    <div className={styles.container}>
      <VendingMachine />
    </div>
  );
}
