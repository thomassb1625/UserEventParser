import { parse } from "path";

const ethers = require('ethers');
const fs = require('fs')

export async function getLogs(intrfc: any, topic: string, contractAddr: string, startBlock: number, endBlock:number) {

  let users: string[] = new Array();

  try {
    users = JSON.parse(await fs.readFileSync('data/users.json'));
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

    let user = parsedLog.args[2];

    if(users.indexOf(user) === -1) users.push(user);
  }

  fs.writeFileSync('data/users_v' + startBlock + '.json', JSON.stringify(users));
  fs.writeFileSync('data/lastBlock.txt', endBlock.toString());
}