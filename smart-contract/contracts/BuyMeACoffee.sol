// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";


//deployed to seploia at 0x57C96B6eDE2E5513bc40E69f65436A09Ec21dDC7 and again  0x5FbDB2315678afecb367f032d93F642f64180aa3  0x20DeA510CeB46CcF1a135565Bd888FE13498e13d

contract BuyMeACoffee {
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    //list of all memos received from friends
    Memo[] memos;

    //Address of deployer. we gave this address a specific ability to receive ethers
    address payable owner;

    //deploy owner
    constructor() {
        owner = payable(msg.sender);
    }

    /**
     * @dev buy a coffee for contract owner
     * @param _name name of the coffee buyer
     * @param _message a nice message from the coffee buyer
     */

    function BuyCoffee(
        string memory _name,
        string memory _message
    ) public payable {
        require(msg.value > 0, "Can't buy a coffee with 0 eth");

        //add the memo to storage
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        // emit a log event when a new memo is created
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    /**
     * @dev send the entire balance stored in this contract to the owner

     */

    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }

    /**
     * @dev retrieve all the memos stroed in the blockchain
     */

    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }
}
