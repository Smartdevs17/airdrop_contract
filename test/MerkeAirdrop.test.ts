import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from 'chai';
import { ethers } from 'hardhat';
import merkle from "../merkle";
const { generateMerkleRoot,  generateMerkleProof } = merkle;

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
    
    
        const merkleRoot = await generateMerkleRoot();
        
        const merkleAirdrop = await MerkleAirdrop.deploy(token, merkleRoot);  
        const rewardAmount = ethers.parseEther("1000.0");
        

        await token.transfer(await merkleAirdrop.getAddress(), rewardAmount);

        return { token, merkleAirdrop, merkleRoot, owner, user1, user2, user3, user4, user5, user6, user7 };
    }


  it('Should deploy with the correct merkle root', async function () {
    const { merkleAirdrop, merkleRoot } = await loadFixture(deployMerkleAirdropFixture);
    expect( merkleAirdrop).to.be.ok;
    expect(await merkleAirdrop.merkleRoot()).to.equal(merkleRoot);
  });

  it('Should allow valid claims', async function () {
    const { merkleAirdrop, user1, token  } = await loadFixture(deployMerkleAirdropFixture);
    const amount = ethers.parseEther("100.0").toString();
    const proof = await generateMerkleProof( user1.address, amount);
    await merkleAirdrop.connect(user1).claim(user1.address, amount, proof);
    

    // Check if the user has received the token
    expect(await token.balanceOf(user1.address)).to.equal(amount);
  });

  it('Should reject invalid claims', async function () {
    const { merkleAirdrop, user7,  } = await loadFixture(deployMerkleAirdropFixture);
    const amount = ethers.parseEther("100.0").toString();
    const proof = await generateMerkleProof( user7.address, amount);

    await expect(merkleAirdrop.connect(user7).claim(user7.address, amount, proof)).to.be.revertedWith('Invalid proof');
  });

  it('Should handle double claims correctly', async function () {
    const { merkleAirdrop, user1, token} = await loadFixture(deployMerkleAirdropFixture);
    // Assuming user1 has a valid proof and tries to claim twice
    const amount = ethers.parseEther("100.0").toString();
    const proof = await generateMerkleProof( user1.address, amount);
    await merkleAirdrop.connect(user1).claim(user1.address, amount, proof);

    // Check if the user has received the token
    expect(await token.balanceOf(user1.address)).to.equal(amount);

    // Attempt to claim again with the same proof
    await expect(merkleAirdrop.connect(user1).claim(user1.address, amount, proof)).to.be.revertedWith('Already claimed');
  });

  it('Should handle invalid proofs correctly', async function () {
    const { merkleAirdrop, user2} = await loadFixture(deployMerkleAirdropFixture);
    // Assuming user1 has an invalid proof
    const amount = ethers.parseEther("1.0").toString();
    const proof = await generateMerkleProof(user2.address, amount);

    await expect(merkleAirdrop.connect(user2).claim(user2.address, amount, proof)).to.be.revertedWith('Invalid proof');
  });
});
