import { parse } from "path";

const ethers = require('ethers');
const fs = require('fs')

export async function getLogs(intrfc: any, topic: string, contractAddr: string, startBlock: number, endBlock:number) {

  let cutOffBlock = 3388314;

  let fallUsers: string[] = new Array();
  let winterUsers: string[] = new Array();

  try {
    fallUsers = JSON.parse(await fs.readFileSync('data/fallUsers.json'));
    winterUsers = JSON.parse(await fs.readFileSync('data/winterUsers.json'));
  } catch (e) {
    console.log('Files not found');
  }

  let providerRPC = {
    moonbase: {
      name: 'moonbase-alpha',
      rpc: 'https://rpc.api.moonbase.moonbeam.network',
      chainId: 1287,
    },
  };

  let provider = new ethers.providers.StaticJsonRpcProvider(
    providerRPC.moonbase.rpc,
    {
        chainId: providerRPC.moonbase.chainId,
        name: providerRPC.moonbase.name,
  });

  console.log(startBlock);
  console.log(endBlock);

  if (endBlock == 0) {
    endBlock = await provider.getBlockNumber();
  }

  console.log(endBlock);

  let rawLogs: Array<any> = new Array();

  let i = startBlock

  console.log("Calling all events starting at block " + i);

  let errCount = 0;

  while (i < endBlock) {
    console.log("Retrieving logs from block " + i);

    try {
      let newLogs: Array<any> = await provider.getLogs({
          address: contractAddr,
          topics: [ethers.utils.id(topic)],
          fromBlock: i,
          toBlock: (i + 2048) < endBlock ? (i + 2048) : endBlock
      });

      rawLogs = rawLogs.concat(newLogs);

      i += 2048;

      errCount = 0;
    } catch (e) {
      console.log(e);
      errCount += 1;
      if (errCount > 2) {
        i += 2048
        continue;
      }
    }
  }

  console.log("Found " + rawLogs.length + " events so far");

  for (const log of rawLogs) {
    let parsedLog = intrfc.parseLog(log);

    let user = "";

    if (startBlock > 3106205) {
      user = parsedLog.args[2];
    } else {
      user = parsedLog.args[1];
    }

    console.log(log);
    let block = JSON.parse(JSON.stringify(log)).blockNumber;

    if (block < cutOffBlock) {
      if(fallUsers.indexOf(user) === -1) fallUsers.push(user);
    }else{
      if(winterUsers.indexOf(user) === -1) winterUsers.push(user);
    }
  }

  fs.writeFileSync('data/fallUsers.json', JSON.stringify(fallUsers));
  fs.writeFileSync('data/winterUsers.json', JSON.stringify(winterUsers));
}