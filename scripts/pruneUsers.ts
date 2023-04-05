const fs = require('fs')

async function pruneUsers() {

    let deploymentBlocks = [2804761,2862668,2950246,3068748,3078978,3106205,3283501,3327307,3357919,3395391,3648868, 3766081, 3913760];

    let users: string[] = new Array();

    for (let i = 0; i < deploymentBlocks.length; i++) {
        let newUsers = JSON.parse(await fs.readFileSync('data/users_v' + deploymentBlocks[i] + '.json'));
        console.log(newUsers);
        newUsers.forEach((user: string) => {
            if(users.indexOf(user) === -1) users.push(user);
        });
    }

    console.log(users.length);
    fs.writeFileSync('data/finalUsers.json', JSON.stringify(users));
}

pruneUsers().catch(e => {
    console.log(e);
})