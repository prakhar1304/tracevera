import { Button } from "@/components/ui/button";
import { Loader2, Wallet } from "lucide-react";
import { useContract } from "@/BlockChain/ContractProvider";

const ConnectWalletButton = () => {
  const {
    connectWallet,
    disconnectWallet,
    currentAddress,
    loading,
    isConnected,
  } = useContract();

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  if (isConnected && currentAddress) {
    return (
      <Button variant="outline" className="w-full" onClick={disconnectWallet}>
        <Wallet className="mr-2 h-4 w-4" />
        {formatAddress(currentAddress)}
      </Button>
    );
  }

  return (
    <Button className="w-full" onClick={connectWallet} disabled={loading}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  );
};

export default ConnectWalletButton;
