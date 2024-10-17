// import { useEffect } from "react";
// import { ThirdwebProvider, useContract, useContractRead } from "@thirdweb-dev/react";
// import { Alert, AlertTitle } from "@/components/ui/alert";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { PolygonAmoyTestnet } from "@thirdweb-dev/chains";

// const contractAddress = "0x7874671859088Ef8F46CDC9216b8cF585BFa827F";

// export function ContractInteraction() {
//   const { contract } = useContract(contractAddress);

//   // Check if contract is loaded correctly
//   useEffect(() => {
//     if (contract) {
//       console.log("Contract Loaded: ", contract);
//     }
//   }, [contract]);

//   // Read project name using the contract instance
//   const { data: projectName, isLoading: isProjectNameLoading, error: projectNameError } = useContractRead(contract, "projectName");

//   // Read project details using the contract instance
//   const { data: projectDetails, isLoading: isProjectDetailsLoading, error: projectDetailsError } = useContractRead(contract, "projectDetails");

//   // Log the project name or handle loading and error states
//   useEffect(() => {
//     if (projectName) {
//       console.log("Project Name:", projectName);
//     }
//     if (projectNameError) {
//       console.error("Error reading project name:", projectNameError);
//     }
//   }, [projectName, projectNameError]);

//   // Log the project details or handle loading and error states
//   useEffect(() => {
//     if (projectDetails) {
//       console.log("Project Details:", projectDetails);
//     }
//     if (projectDetailsError) {
//       console.error("Error reading project details:", projectDetailsError);
//     }
//   }, [projectDetails, projectDetailsError]);

//   return (
//     <div>
//       <h1>Smart Contract Interaction</h1>
//       {isProjectNameLoading ? (
//         <p>Loading project name...</p>
//       ) : (
//         <p>Project Name: {projectName || "No project name found"}</p>
//       )}
//       {projectNameError && (
//         <Alert variant="destructive">
//           <AlertTitle>Error</AlertTitle>
//           <p>{String(projectNameError.message)}</p>
//         </Alert>
//       )}

//       {isProjectDetailsLoading ? (
//         <p>Loading project details...</p>
//       ) : (
//         <p>Project Details: {projectDetails || "No project details found"}</p>
//       )}
//       {projectDetailsError && (
//         <Alert variant="destructive">
//           <AlertTitle>Error</AlertTitle>
//           <p>{String(projectDetailsError.message)}</p>
//         </Alert>
//       )}
//     </div>
//   );
// }

// export default function App() {
//   const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID; // Use the environment variable

//   return (
//     <ThirdwebProvider 
//       clientId={clientId} // Use the clientId from env variable
//       activeChain={PolygonAmoyTestnet}
//     >
//       <ContractInteraction />
//     </ThirdwebProvider>
//   );
// }
