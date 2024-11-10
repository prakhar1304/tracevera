import React, { useState } from "react";
import { useContract } from "../BlockChain/ContractProvider";

const TestPage: React.FC = () => {
  const {
    registerUser,
    registerIssuer,
    issueCertificate,
    invalidateCertificate,
    getProfile,
    getCertificate,
  } = useContract();

  const [name, setName] = useState("");
  const [uuid, setUUID] = useState("");
  const [userAddr, setUserAddr] = useState("");
  const [hashValue, setHashValue] = useState("");
  const [ipfsUrl, setIpfsUrl] = useState("");

  const handleRegisterUser = async () => {
    await registerUser(name);
    alert("User registered!");
  };

  const handleRegisterIssuer = async () => {
    await registerIssuer(name);
    alert("Issuer registered!");
  };

  const handleIssueCertificate = async () => {
    await issueCertificate(userAddr, uuid, hashValue, ipfsUrl);
    alert("Certificate issued!");
  };

  const handleInvalidateCertificate = async () => {
    await invalidateCertificate(uuid);
    alert("Certificate invalidated!");
  };

  const handleGetProfile = async () => {
    const profile = await getProfile();
    console.log(profile);
    alert(`Profile: ${profile}`);
  };

  const handleGetCertificate = async () => {
    const certificate = await getCertificate(uuid);
    console.log(certificate);
    alert(`Certificate: ${certificate}`);
  };

  return (
    <div>
      <h1>Test Smart Contract Functions</h1>

      <div>
        <h2>Register User</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleRegisterUser}>Register User</button>
      </div>

      <div>
        <h2>Register Issuer</h2>
        <input
          type="text"
          placeholder="Issuer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleRegisterIssuer}>Register Issuer</button>
      </div>

      <div>
        <h2>Issue Certificate</h2>
        <input
          type="text"
          placeholder="User Address"
          value={userAddr}
          onChange={(e) => setUserAddr(e.target.value)}
        />
        <input
          type="text"
          placeholder="UUID"
          value={uuid}
          onChange={(e) => setUUID(e.target.value)}
        />
        <input
          type="text"
          placeholder="Hash Value"
          value={hashValue}
          onChange={(e) => setHashValue(e.target.value)}
        />
        <input
          type="text"
          placeholder="IPFS URL"
          value={ipfsUrl}
          onChange={(e) => setIpfsUrl(e.target.value)}
        />
        <button onClick={handleIssueCertificate}>Issue Certificate</button>
      </div>

      <div>
        <h2>Invalidate Certificate</h2>
        <input
          type="text"
          placeholder="UUID"
          value={uuid}
          onChange={(e) => setUUID(e.target.value)}
        />
        <button onClick={handleInvalidateCertificate}>
          Invalidate Certificate
        </button>
      </div>

      <div>
        <h2>Get Profile</h2>
        <button onClick={handleGetProfile}>Get Profile</button>
      </div>

      <div>
        <h2>Get Certificate</h2>
        <input
          type="text"
          placeholder="UUID"
          value={uuid}
          onChange={(e) => setUUID(e.target.value)}
        />
        <button onClick={handleGetCertificate}>Get Certificate</button>
      </div>
    </div>
  );
};

export default TestPage;
