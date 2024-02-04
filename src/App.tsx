import "./App.css";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useDisconnect } from "wagmi";

function App() {
  const { open } = useWeb3Modal();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  if (address) {
    return (
      <>
        <p>Connected as {address}</p>
        <button onClick={() => disconnect()}>Disconnect</button>
      </>
    );
  }

  return (
    <>
      <button onClick={() => open()}>Connect</button>
    </>
  );
}

export default App;
