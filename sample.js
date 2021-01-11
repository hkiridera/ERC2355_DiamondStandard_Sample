//const { ethers } = require("ethers"); // ethers非対応, 関数のシグネチャが取得できず。
const Web3EthContract  = require('web3-eth-contract');
const Diamond = require('./build/contracts/Diamond.json')
const DiamondLoupeFacet = require('./build/contracts/DiamondLoupeFacet.json')
const DiamondCutFacet = require('./build/contracts/DiamondCutFacet.json')
const OwnershipFacet = require('./build/contracts/OwnershipFacet.json')
const Test1Facet = require('./build/contracts/Test1Facet.json')
const Test2Facet = require('./build/contracts/Test2Facet.json')

const FacetCutAction = {
  Add: 0,
  Replace: 1,
  Remove: 2
}

const zeroAddress = '0x0000000000000000000000000000000000000000'
const fromAddress = '0xb94AB5113541d61F5aC84Daa8A31c80FF31962f5'

// コントラクトから関数の識別コードを取得する。
function getSelectors (contract) {
  const selectors = contract._jsonInterface.reduce((acc, val) => {
    if (val.type === 'function') {
      acc.push(val.signature)
      return acc
    } else {
      return acc
    }
  }, [])
  //console.log(selectors)
  return selectors
}


(async () => {
  Web3EthContract.setProvider('http://localhost:8545');

  // ダイアモンド
  const diamondAddress = Diamond.networks[Object.keys(Diamond.networks)[0]].address
  const diamondContract = new Web3EthContract(Diamond.abi, diamondAddress)

  // ダイアモンドルーペファセット(ダイアモンドのアドレスに、ルーペファセットのABI)
  const diamondLoupeFacetAddress = DiamondLoupeFacet.networks[Object.keys(DiamondLoupeFacet.networks)[0]].address
  const diamondLoupeFacetContract = new Web3EthContract(DiamondLoupeFacet.abi, diamondAddress)

  // ダイアモンドカット(ダイアモンドのアドレスに、ルーペファセットのABI)
  const diamondCutFacetAddress = DiamondCutFacet.networks[Object.keys(DiamondCutFacet.networks)[0]].address
  const diamondCutFacetContract = new Web3EthContract(DiamondCutFacet.abi, diamondAddress)

  // オーナーシップファセット(ダイアモンドのアドレスに、ルーペファセットのABI)
  const ownershipFacetAddress = OwnershipFacet.networks[Object.keys(OwnershipFacet.networks)[0]].address
  const ownershipFacetContract = new Web3EthContract(OwnershipFacet.abi, diamondAddress)

  // テストファセット(ダイアモンドのアドレスに、ルーペファセットのABI)
  const test1FacetAddress = Test1Facet.networks[Object.keys(Test1Facet.networks)[0]].address
  const test1FacetContract = new Web3EthContract(Test1Facet.abi, diamondAddress)

  const test2FacetAddress = Test2Facet.networks[Object.keys(Test2Facet.networks)[0]].address
  const test2FacetContract = new Web3EthContract(Test2Facet.abi, diamondAddress)

  
  
  
  try {
    // compile済みのjsonファイルを与えると、関数識別子の一覧が返る
    let selectors = getSelectors(test1FacetContract).slice(0, -1)
    // 関数の識別子をdiamond standardに登録する
    //diamondContract.diamondCut([[追加するデプロイ済みcontractAddreess, FacetCutAction.Add, ABIの関数郡]], nullのアドレス, '0x')
    await diamondCutFacetContract.methods.diamondCut([[test1FacetAddress, FacetCutAction.Add, selectors]], zeroAddress, '0x').send({ from: fromAddress, gas: 100000000, gasPrice: 0 })

    selectors = getSelectors(test2FacetContract).slice(0, -1)
    await diamondCutFacetContract.methods.diamondCut([[test2FacetAddress, FacetCutAction.Add, selectors]], zeroAddress, '0x').send({ from: fromAddress, gas: 100000000, gasPrice: 0 })

  } catch (error) {
    console.log(error)
  }


  // テストファセットの関数呼び出し
  console.log(await test1FacetContract.methods.test1Func2().call({ from: fromAddress, gas: 100000000, gasPrice: 0 }))
  console.log(await test2FacetContract.methods.test2Func2().call({ from: fromAddress, gas: 100000000, gasPrice: 0 }))
  
  // 値の更新
  await test1FacetContract.methods.test1Func1().send({ from: fromAddress, gas: 100000000, gasPrice: 0 })
  // test1Funcだけ変えても、test2Funcでも変更結果を取得可能
  console.log(await test1FacetContract.methods.test1Func2().call({ from: fromAddress, gas: 100000000, gasPrice: 0 }))
  console.log(await test2FacetContract.methods.test2Func2().call({ from: fromAddress, gas: 100000000, gasPrice: 0 }))

  
})()