import { ethers } from "hardhat";
import MerkleTree from "merkletreejs";
import path from "path";
import csvParser from "csv-parser";
const fs = require("fs");
import keccak256 from "keccak256";

// Function to generate merkle root
async function generateMerkleRoot(): Promise<string> {
  return new Promise((resolve, reject) => {
    let results: Buffer[] = [];

    fs.createReadStream('addresses.csv')
      .pipe(csvParser())
      .on('data', (row: { address: string; amount: string }) => {  // Specify the type for 'row'
        const address = row.address;
        const amount = row.amount;
        const leaf = keccak256(
          ethers.solidityPacked(["address", "uint256"], [address, amount])
        );
        results.push(leaf);
      })
      .on('end', () => {
        const tree = new MerkleTree(results, keccak256, {
          sortPairs: true,
        });

        const roothash = tree.getHexRoot();
        console.log('Merkle Root:', roothash);

        resolve(roothash);  // Resolve the promise with the merkle root
      })
      .on('error', reject); // Reject the promise if there's an error
  });
}

// Function to generate merkle proof
async function generateMerkleProof(address: string, amount: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    generateMerkleRoot()
      .then((merkleRoot) => {
        const targetLeaf = keccak256(
          ethers.solidityPacked(["address", "uint256"], [address, amount])
        );

        const tree = new MerkleTree([targetLeaf], keccak256, {
          sortPairs: true,
        });
        const proof = tree.getHexProof(targetLeaf);
        resolve(proof);
      })
      .catch(reject);
  });
}

// async function generateMerkleProofWithRoot(root: string, targetAddress: string, targetAmount: string, userData: { address: string, amount: string }[]): Promise<string[]> {
//   return new Promise((resolve, reject) => {
//     console.log(`Starting to generate proof for address: ${targetAddress}, amount: ${targetAmount}`);

//     let results: Buffer[] = userData.map((user) => 
//       keccak256(
//         ethers.solidityPacked(["address", "uint256"], [user.address, user.amount])
//       )
//     );

//     const tree = new MerkleTree(results, keccak256, {
//       sortPairs: true,
//     });

//     const targetLeaf = keccak256(
//       ethers.solidityPacked(["address", "uint256"], [targetAddress, targetAmount])
//     );

//     const proof = tree.getHexProof(targetLeaf);
//     console.log(proof);
    
//     resolve(proof);
//   });
// }

async function generateMerkleProofWithRoot(root: string, targetAddress: string, targetAmount: string, ): Promise<string[]> {
  const userData = await getUserDataFromCSV();
  
  return new Promise((resolve, reject) => {
    console.log(`Starting to generate proof for address: ${targetAddress}, amount: ${targetAmount}`);

    let results: Buffer[] = userData.map((user) => 
      keccak256(
        ethers.solidityPacked(["address", "uint256"], [user.address, user.amount])
      )
    );

    const tree = new MerkleTree(results, keccak256, {
      sortPairs: true,
    });

    const targetLeaf = keccak256(
      ethers.solidityPacked(["address", "uint256"], [targetAddress, targetAmount])
    );

    const proof = tree.getHexProof(targetLeaf);
    // console.log(proof);
    
    resolve(proof);
  });
}

async function getUserDataFromCSV(): Promise<{ address: string, amount: string }[]> {
  return new Promise((resolve, reject) => {
    let userData: { address: string, amount: string }[] = [];

    fs.createReadStream('addresses.csv')
      .pipe(csvParser())
      .on('data', (row: { address: string; amount: string }) => {  // Specify the type for 'row'
        userData.push({ address: row.address, amount: row.amount });
      })
      .on('end', () => {
        resolve(userData);
      })
      .on('error', reject);
  });
}

async function generateMerkleRootFromArray(data: { address: string, amount: string }[]): Promise<string> {
  return new Promise((resolve, reject) => {
    let results: Buffer[] = data.map((user) => 
      keccak256(
        ethers.solidityPacked(["address", "uint256"], [user.address, user.amount])
      )
    );

    const tree = new MerkleTree(results, keccak256, {
      sortPairs: true,
    });

    const roothash = tree.getHexRoot();
    console.log('Merkle Root:', roothash);

    resolve(roothash);  // Resolve the promise with the merkle root
  });
}

export default { generateMerkleRoot, generateMerkleProof, generateMerkleProofWithRoot, getUserDataFromCSV, generateMerkleRootFromArray };
// export default { generateMerkleProofWithRoot, generateMerkleRootFromArray };