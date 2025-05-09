"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Shield } from "lucide-react";
import { useContract } from "@/BlockChain/ContractProvider";
import ConnectWalletButton from "@/components/ConnectWallet";

type UserType = "government" | "contractor" | "citizen" | "";

export default function Login() {
  const { error } = useContract();
  const [userType, setUserType] = useState<UserType>("");
  const [hoveredSide, setHoveredSide] = useState<"left" | "right" | null>(null);
  const navigate = useNavigate();

  const handleLogin = (
    e: React.FormEvent,
    type: "gov-contractor" | "citizen"
  ) => {
    e.preventDefault();
    if (type === "gov-contractor") {
      if (userType === "government") {
        navigate("/gov-dashboard");
      } else if (userType === "contractor") {
        navigate("/contractor-dashboard");
      }
    } else {
      navigate("/citizenHome");
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-primary/10 to-secondary/10">
      <div
        className={`flex-1 flex items-center justify-center transition-colors duration-300 ${
          hoveredSide === "left" ? "bg-black/10" : ""
        }`}
        onMouseEnter={() => setHoveredSide("left")}
        onMouseLeave={() => setHoveredSide(null)}
      >
        <Card className="w-full max-w-md shadow-lg m-4">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Government & Contractor
            </CardTitle>
            <CardDescription className="text-center">
              Login to access your professional account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ConnectWalletButton />
            {error && <p className="text-sm text-red-500">{error}</p>}
            {/* <div>Wallet Balance: {balance} ETH</div> */}
            {/* <ConnectWallet className="w-full" /> */}
            <Separator />
            <form
              onSubmit={(e) => handleLogin(e, "gov-contractor")}
              className="space-y-4"
            >
              <Select
                value={userType}
                onValueChange={(value: UserType) => setUserType(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select User Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="contractor">Contractor</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full" disabled={!userType}>
                <Shield className="mr-2 h-4 w-4" /> Sign in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <CardFooter className="flex flex-col items-center space-y-2 text-center absolute bottom-0 left-0 right-0 pb-4">
        <p className="text-sm text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
        <p className="text-xs text-muted-foreground">
          © 2023 Your Company Name. All rights reserved.
        </p>
      </CardFooter>
    </div>
  );
}
