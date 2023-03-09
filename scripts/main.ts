import { getLogs } from "./getLogs";

const masterEventsAbi1 = require('../ABIs/MasterEvents1.json');
const masterEventsAbi2 = require('../ABIs/MasterEvents2.json');
const ethers = require('ethers');

async function main() {
    let contractAddresses = [//"0x62625bec190C6cce53e8ff6Aa8850c3aD5748902",
    // "0x8a82B653C37f468F43c3b7b33DD07adB0F7DC546",
    // "0x724790E8797c3c196d6C656625C1d424BBaCe9B2",
    // "0xcBA4e7628bd7fFb9C4bF331eC075431a6Bef6749",
    // "0x2CD605f8B5166cecf51013A312E992A24bc9bED6",
    // "0xe6a86bADE9179522DEFcB7A281afa89D77116BbA",
    // "0x0ca549BBc6937ad22Dc12E56497791B63EC9FCAd",
    // "0x9bA8C9c60C13075212ff01b6f538E99eA0B22db1",
    // "0xb8226Dfc751c82159413576d0d916886A60e60e3",
    // "0xb52F6414703C4233c8Ad9AE65F289Ecf9FE499C4",
    //"0x0298d98C67387c79a118aF2886348F9cA7A3a900",
    "0x54F967B8a135e44E233dA070eA88C5E4a53BaCAC"];

    let deploymentBlocks = [/*2804761,2862668,2950246,3068748,3078978,3106205,3283501,3327307,3357919,3395391,3648868, */3766081];

    let lastBlock = [/*2867362,3097542,3635977,3078717,3109709,3696335,3325844,3364014,3394623,0,0, */0];

    let iface1 = new ethers.utils.Interface(masterEventsAbi1);
    let iface2 = new ethers.utils.Interface(masterEventsAbi2);

    console.log(deploymentBlocks[0]);

    for (let i = 0; i < contractAddresses.length; i++) {
        //if (i < 6) {
            //await getLogs(iface1, "LoanMarketEntered(address,address)", contractAddresses[i], deploymentBlocks[i], lastBlock[i]);
        //} else {
        await getLogs(iface2, "LoanMarketEntered(address,uint256,address)", contractAddresses[i], deploymentBlocks[i], lastBlock[i]);
        //}
    }

}

main().catch( e => {
    console.log(e)
})