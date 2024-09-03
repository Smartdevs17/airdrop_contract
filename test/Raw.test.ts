import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from 'chai';
import { ethers } from 'hardhat';
import merkle from "../merkle";
const { generateMerkleRoot, generateMerkleProof } = merkle;

describe('MerkleAirdrop', function () {
    async function deployTokenFixture() {
        const SmartDev = await ethers.getContractFactory("SmartDev");
        const token = await SmartDev.deploy();
        return { token };
    }

    async function deployMerkleAirdropFixture() {
        const { token } = await loadFixture(deployTokenFixture);
        const MerkleAirdrop = await ethers.getContractFactory("MerkleAirdrop");
        const signers = await ethers.getSigners();
        const [owner, user1, user2, user3, user4, user5, user6, user7] = signers;
    
        const userData = [
            { address: user1.address, amount: ethers.parseEther("1.0").toString() },
            { address: user2.address, amount: ethers.parseEther("2.0").toString() },
            { address: user3.address, amount: ethers.parseEther("3.0").toString() },
            { address: user4.address, amount: ethers.parseEther("4.0").toString() },
            { address: user5.address, amount: ethers.parseEther("5.0").toString() },
            { address: user6.address, amount: ethers.parseEther("6.0").toString() }
            
        ];
        // const hash = await generateMerkleRootFromArray(userData);
        const hash = await generateMerkleRoot();
        
        const merkleRoot =  hash;        
        const merkleAirdrop = await MerkleAirdrop.deploy(token, merkleRoot);  
        const rewardAmount = ethers.parseEther("100.0");
        

        await token.transfer(await merkleAirdrop.getAddress(), rewardAmount);
        const contractBalance = await token.balanceOf(await merkleAirdrop.getAddress());
        // console.log(`Contract balance: ${contractBalance.toString()}`);

        return { token, merkleAirdrop, hash, userData, merkleRoot, owner, user1, user2, user3, user4, user5, user6, user7 };
    }


  it('Should deploy with the correct merkle root', async function () {
    const { merkleAirdrop, merkleRoot } = await loadFixture(deployMerkleAirdropFixture);
    expect(await merkleAirdrop.merkleRoot()).to.equal(merkleRoot);
  });

  it('Should allow valid claims', async function () {
    const { merkleAirdrop, hash, userData, user1, token  } = await loadFixture(deployMerkleAirdropFixture);
    const amount = ethers.parseEther("100.0").toString();
    // const proof = await generateMerkleProofWithRoot(hash, user1.address, amount, userData);
    const proof = await generateMerkleProof(user1.address, amount);
    console.log(`Address: ${user1.address}`);
    console.log(`Amount: ${amount}`);
    console.log(`Proof: ${proof}`);
    await merkleAirdrop.connect(user1).claim(user1.address, amount, proof);
    

//     // Check if the user has received the token
//     expect(await token.balanceOf(user1.address)).to.equal(amount);
//   });

//   it('Should reject invalid claims', async function () {
//     const { merkleAirdrop, user7, hash, userData } = await loadFixture(deployMerkleAirdropFixture);
//     const amount = ethers.parseEther("100.0").toString();
//     const proof = await generateMerkleProofWithRoot(hash, user7.address, amount, userData);

//     await expect(merkleAirdrop.connect(user7).claim(user7.address, amount, proof)).to.be.revertedWith('Invalid proof');
//   });

//   it('Should handle double claims correctly', async function () {
//     const { merkleAirdrop, user1, token, hash,userData } = await loadFixture(deployMerkleAirdropFixture);
//     // Assuming user1 has a valid proof and tries to claim twice
//     const amount = ethers.parseEther("1.0").toString();
//     const proof = await generateMerkleProofWithRoot(hash, user1.address, amount, userData);
//     await merkleAirdrop.connect(user1).claim(user1.address, amount, proof);

//     // Check if the user has received the token
//     expect(await token.balanceOf(user1.address)).to.equal(amount);

//     // Attempt to claim again with the same proof
//     await expect(merkleAirdrop.connect(user1).claim(user1.address, amount, proof)).to.be.revertedWith('Already claimed');
//   });

//   it('Should handle invalid proofs correctly', async function () {
//     const { merkleAirdrop, user2, hash, userData } = await loadFixture(deployMerkleAirdropFixture);
//     // Assuming user1 has an invalid proof
//     const amount = ethers.parseEther("1.0").toString();
//     const proof = await generateMerkleProofWithRoot(hash, user2.address, amount, userData);

//     await expect(merkleAirdrop.connect(user2).claim(user2.address, amount, proof)).to.be.revertedWith('Invalid proof');
  });
});


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


// // Function to generate merkle proof
// async function generateMerkleProof(address: string, amount: string): Promise<string[]> {
//   return new Promise((resolve, reject) => {
//     generateMerkleRoot()
//       .then(() => {
//         const targetLeaf = keccak256(
//           ethers.solidityPacked(["address", "uint256"], [address, amount])
//         );

//         const tree = new MerkleTree([targetLeaf], keccak256, {
//           sortPairs: true,
//         });
//         const proof = tree.getHexProof(targetLeaf);
//         resolve(proof);
//       })
//       .catch(reject);
//   });
// }


// async function generateMerkleRootFromArray(data: { address: string, amount: string }[]): Promise<string> {
//   return new Promise((resolve, reject) => {
//     let results: Buffer[] = data.map((user) => 
//       keccak256(
//         ethers.solidityPacked(["address", "uint256"], [user.address, user.amount])
//       )
//     );

//     const tree = new MerkleTree(results, keccak256, {
//       sortPairs: true,
//     });

//     const roothash = tree.getHexRoot();
//     console.log('Merkle Root:', roothash);

//     resolve(roothash); 
//   });
// }