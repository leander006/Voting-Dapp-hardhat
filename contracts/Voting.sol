// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

error Voting__CannotVoteAgain();

contract Voting {
    // Mapping to store name of political parties with no of votes
    // Enum to store name of party
    // Function to vote
    // to check whether already voted
    // to close voting option after 7 - 8 hours
    // to display result after 7-8 hours
    string[] Parties;
    mapping(uint256 => uint256) voting;
    mapping(address => bool) voters;

    // Events //

    event Voted(address indexed voter);

    // Constructor //
    constructor(string[] memory _Parties) {
        Parties = _Parties;
    }

    // Function //

    function vote(uint256 partyNo) public {
        if (voters[msg.sender] == true) {
            revert Voting__CannotVoteAgain();
        }
        voters[msg.sender] = true;
        voting[partyNo]++;
        emit Voted(msg.sender);
    }

    function getPartiesName(uint256 no) public view returns (string memory) {
        return Parties[no];
    }

    function votingStatus(address name) public view returns (bool) {
        return voters[name];
    }

    function getVotes(uint256 no) public view returns (uint256) {
        return voting[no];
    }

    function getWinner() public view returns(string memory){
        

        
    }
}
