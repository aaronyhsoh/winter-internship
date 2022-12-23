// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract HtlcBond {

    constructor() public {
    }

    mapping(address => Htlc) senderHtlc;
    mapping(address => Htlc) receiverHtlc; 

    struct Htlc {
        address sender;
        address receiver;
        string hash;
        string secret;
        uint256 timeout; // timeout time if secret has not been provided by then
        uint256 price;
    }

    event create(string);
    event withdraw(string);
    event debugSecret(bytes32);
    event generatedHash(bytes32);

    function createHtlc(address receiver, string memory hash, uint256 timeoutPeriod) public payable {
        require(senderHtlc[msg.sender].sender == address(0) , "Sender have an existing open htlc contract");
        require(msg.value > 0, "No ether received");

        // create new htlc contract
        Htlc storage newHtlc = senderHtlc[msg.sender];
        newHtlc.sender = msg.sender;
        newHtlc.receiver = receiver;
        newHtlc.hash = hash;
        newHtlc.timeout = block.timestamp + timeoutPeriod; 
        newHtlc.price = msg.value;
        emit create("Successful");

        senderHtlc[msg.sender] = newHtlc;
        receiverHtlc[receiver] = newHtlc;
    }

    // but how to ensure that the hash in corda and eth is the same
    function withdrawEther(string memory secret) public {
        Htlc storage htlc = receiverHtlc[msg.sender];

        emit debugSecret(keccak256(abi.encodePacked(secret)));
        emit generatedHash(bytes32(bytes(htlc.hash)));
        require(htlc.sender != address(0), "No htlc for withdrawal found");
       
        require(keccak256(abi.encodePacked(secret)) == bytes32(bytes(htlc.hash)), "Secret provided is incorrect");

        // release ether
        payable (msg.sender).transfer(htlc.price);

        // remove from mapping
        delete receiverHtlc[msg.sender];
        delete senderHtlc[htlc.sender];     
        emit withdraw("Withdrawal successful");
    }

    function getContractBalance() public view returns(uint256) {
        return address(this).balance;
    }
}
