# Merkle Airdrop Project

## Overview

This project provides a Merkle Airdrop contract and a script to generate Merkle proofs for claiming the airdrop. The project consists of a `merkle.ts` file, which contains the implementation of the Merkle tree and proof generation, and a `MerkleAirdrop` contract.

## Setup and Run

To set up and run the project, follow these steps:

1. Install the required dependencies:
   ```
   npm install
   ```
2. Run the script:
   ```
   node merkle.ts
   ```

## Deploying the MerkleAirdrop Contract

To deploy the MerkleAirdrop contract, follow these steps:

1. Compile the contract using your preferred Solidity compiler.
2. Deploy the contract to your preferred blockchain network.
3. Provide the address of the ERC20 token and the Merkle root as constructor arguments.

## Generating Proofs

To generate a Merkle proof for claiming the airdrop, follow these steps:

1. Prepare a CSV file named `addresses.csv` containing the addresses and amounts for the airdrop.
2. Run the `merkle.ts` script, providing the target address and amount as input.
3. The script will generate the proof and print it to the console.

## Explanation of MerkleAirdrop.sol Functions

The `MerkleAirdrop` contract has the following functions:

- `constructor`: Initializes the contract with the ERC20 token address and the Merkle root.
- `claim`: Allows users to claim the airdrop by providing their address, amount, and Merkle proof.
- `merkleRoot`: Returns the Merkle root used for the airdrop.
- `token`: Returns the address of the ERC20 token used for the airdrop.

## Assumptions and Limitations

- The script assumes that the addresses and amounts for the airdrop are stored in a CSV file named `addresses.csv`.
- The MerkleAirdrop contract assumes that the ERC20 token has already been deployed and that the contract has been funded with the airdrop tokens.
- The script and the contract assume that the Merkle root is a valid 32-byte hash.

## Implementation Details

The `merkle.ts` file implements the Merkle tree and proof generation using the `MerkleTree` class from the `merkletreejs` library. The `MerkleAirdrop` contract is implemented in Solidity and uses the Merkle proof to verify the eligibility of users to claim the airdrop.

## Testing the Application

To test the application, you can use the provided test files in the `test` directory. These tests cover various scenarios such as deploying the contract with the correct Merkle root, allowing valid claims, rejecting invalid claims, and handling double claims correctly.

To run the tests, execute the following command in your terminal:
```
npx hardhat test
```
