// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; 

contract MerkleAirdrop {
    IERC20 public token;
    bytes32 public merkleRoot;
    mapping(address => bool) public hasClaimed;

    event Claim(address indexed user, uint256 amount);

    constructor(IERC20 _token, bytes32 _merkleRoot) {
        token = _token;
        merkleRoot = _merkleRoot;
    }

    function claim(address _address, uint256 amount, bytes32[] memory proof) public {
        require(!hasClaimed[_address], "Already claimed");
        
        bytes32 computedHash = keccak256(abi.encodePacked(_address, amount));        
        require(MerkleProof.verify(proof, merkleRoot, computedHash), "Invalid proof");

        hasClaimed[_address] = true;
        token.transfer(_address, amount);
        emit Claim(_address, amount);
    }


    function updateMerkleRoot(bytes32 _merkleRoot) public {
        merkleRoot = _merkleRoot;
    }

    function withdrawRemainingTokens() public {
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }
}
