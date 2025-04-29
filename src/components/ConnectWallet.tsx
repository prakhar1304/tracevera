import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet, AlertCircle } from "lucide-react";
import { useContract } from "@/BlockChain/ContractProvider";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ConnectWalletButton = ({
  fullWidth = true,
  showError = true,
}: {
  fullWidth?: boolean;
  showError?: boolean;
}) => {
  const { connectWallet, disconnectWallet, address, loading, error } =
    useContract();

  const formatAddress = (address: string) => {
    return address
      ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
      : "";
  };

  if (address) {
    return (
      <Button
        variant="outline"
        className={fullWidth ? "w-full" : ""}
        onClick={disconnectWallet}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {formatAddress(address)}
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      <Button
        className={fullWidth ? "w-full" : ""}
        onClick={connectWallet}
        disabled={loading}
      >
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

      {showError && error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ConnectWalletButton;
