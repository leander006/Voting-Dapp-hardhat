// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

error Voting__CannotVoteAgain();
error Voting__OnlyOwnerCanSetNewVoting();
error Voting__PreviousVotingRemaining();
error Voting__UpKeepNotNeeded();

contract Voting is AutomationCompatibleInterface {
    //State variable //

    uint256 public immutable i_interval; // We are dealing with time in seconds //
    address public immutable i_owner;

    // Voting variable //
    string[] public Parties;
    mapping(uint256 => uint256) voting;
    mapping(address => bool) voters;
    string private s_winner;
    uint256 private s_lastTimeStamp;
    // Events //
    event NewVoting(string[] indexed parties);
    event Voted(address indexed voter);
    event WinnerPicked(string indexed name);

    // Constructor //

    constructor(uint256 _interval) {
        i_interval = _interval;
        i_owner = msg.sender;
        s_lastTimeStamp = block.timestamp;
    }

    // Function //

    function setVoting(string[] memory _Parties) public {
        if (msg.sender != i_owner) {
            revert Voting__OnlyOwnerCanSetNewVoting();
        }
        if ((block.timestamp - s_lastTimeStamp) > i_interval) {
            revert Voting__PreviousVotingRemaining();
        }
        Parties = _Parties;
        for (uint256 i = 0; i < Parties.length; i++) {
            voting[i] = 0;
        }
        emit NewVoting(Parties);
    }

    function vote(uint256 partyNo) public {
        if (voters[msg.sender] == true) {
            revert Voting__CannotVoteAgain();
        }

        voters[msg.sender] = true;
        voting[partyNo]++;
        emit Voted(msg.sender);
    }

    function results() internal {
        uint256 max;
        for (uint256 i = 0; i < Parties.length; i++) {
            if (voting[i] > max) {
                max = voting[i];
            }
            if (voting[i] == max) {
                s_winner = Parties[i];
            }
        }
    }

    function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        upkeepNeeded = (block.timestamp - s_lastTimeStamp) > i_interval;
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        (bool upkeepNeeded, ) = checkUpkeep(" ");
        if (!upkeepNeeded) {
            revert Voting__UpKeepNotNeeded();
        }
        results();
        emit WinnerPicked(s_winner);
        delete Parties;
    }

    // View / Pure //

    function getPartiesName(uint256 no) public view returns (string memory) {
        return Parties[no];
    }

    function votingStatus(address name) public view returns (bool) {
        return voters[name];
    }

    function getInterval() public view returns (uint256) {
        return i_interval;
    }

    function getLatestTimeStamps() public view returns (uint256) {
        return s_lastTimeStamp;
    }

    function getWinner() public view returns (string memory) {
        return s_winner;
    }

    function getVotes(uint256 no) public view returns (uint256) {
        return voting[no];
    }
}
