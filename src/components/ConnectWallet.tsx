// src/components/ConnectWallet.tsx
import React from "react";
import { useAddress, useMetamask, useDisconnect } from "@thirdweb-dev/react";

const ConnectWallet: React.FC = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();

  return (
    <div>
      {!address ? (
        <button onClick={connectWithMetamask}>Connect MetaMask</button>
      ) : (
        <>
          <button onClick={disconnect}>Disconnect Wallet</button>
          <p>Connected: {address}</p>
        </>
      )}
    </div>
  );
};

export default ConnectWallet;
