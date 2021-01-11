// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import './storage.sol';

contract Test1Facet is Storage {
    event TestEvent(address something);

    function test1Func1() external {
        hoge = 1;
    }

    function test1Func2() external view returns(uint256){
        return hoge;
    }

    function test1Func3() external {}

    function test1Func4() external {}

    function test1Func5() external {}

    function test1Func6() external {}

    function test1Func7() external {}

    function test1Func8() external {}

    function test1Func9() external {}

    function test1Func10() external {}

    function test1Func11() external {}

    function test1Func12() external {}

    function test1Func13() external {}

    function test1Func14() external {}

    function test1Func15() external {}

    function test1Func16() external {}

    function test1Func17() external {}

    function test1Func18() external {}

    function test1Func19() external {}

    function test1Func20() external {}

    function supportsInterface(bytes4 _interfaceID) external view returns (bool) {}
}
