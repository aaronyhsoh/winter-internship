// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract HtlcBond {

    constructor() public {
    }

    mapping(address => address) senderToReceiver;
    mapping(address => Htlc) receiveHtlc;

    struct Htlc {
        address sender;
        address receiver;
        bytes32 hash;
        string secret;
        uint256 timeout; // timeout time if secret has not been provided by then
        uint256 price;
    }

    event create(string);
    event withdraw(string);
    event debugSecret(bytes32);
    event generatedHash(bytes32);

    function createHtlc(address receiver, bytes32 hash, uint256 timeoutPeriod) public payable {
        require(senderToReceiver[msg.sender] == address(0) , "Sender have an existing htlc contract");
        require(msg.value > 0, "No ether received");

        Htlc storage newHtlc = receiveHtlc[receiver];
        newHtlc.sender = msg.sender;
        newHtlc.receiver = receiver;
        newHtlc.hash = hash;
        newHtlc.timeout = block.timestamp + timeoutPeriod; 
        newHtlc.price = msg.value;
        emit create("Successful");

        receiveHtlc[receiver] = newHtlc;
        senderToReceiver[msg.sender] = receiver;
    }

    // but how to ensure that the hash in corda and eth is the same?
    // receiver 
    function withdrawEther(string memory secret) public payable {
        Htlc storage htlc = receiveHtlc[msg.sender];
        require(htlc.sender != address(0), "No htlc for withdrawal found");

        // verify timeout
        require(block.timestamp < htlc.timeout, "Timeout exceeded, swap is invalid");
        
        // verify secret
        bytes32 encodedSecret = keccak256(abi.encodePacked(secret));
        bytes32 hash = htlc.hash;
        require(encodedSecret == hash, "Secret provided is incorrect");

        // release ether
        payable (msg.sender).transfer(htlc.price);

        // remove from mapping
        delete receiveHtlc[msg.sender];
        senderToReceiver[htlc.sender] = address(0);     

        require(receiveHtlc[msg.sender].sender == address(0), "receiver mapping not deleted");
        require(senderToReceiver[htlc.sender] == address(0), "sender mapping not deleted");
        emit withdraw("Withdrawal successful");
    }

    function getContractBalance() public view returns(uint256) {
        return address(this).balance;
    }

    function pendingPartyToWithdrawl() public view returns(address) {
        return senderToReceiver[msg.sender];
    }

    function pendingReceiveFrom() public view returns(address) {
        return receiveHtlc[msg.sender].sender;
    }
}
