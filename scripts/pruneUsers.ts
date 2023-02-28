const fs = require('fs')

async function pruneUsers() {
    let fallUsers = JSON.parse(await fs.readFileSync('data/fallUsers.json'));
    let winterUsers = JSON.parse(await fs.readFileSync('data/winterUsers.json'));

    let repeatUsers = 0;
    let uniqueUsers = 0;

    let uniqueWinterUsers: string[] = new Array();

    for (const user of winterUsers) {
        if (fallUsers.indexOf(user) == -1) {
            uniqueUsers += 1;
            uniqueWinterUsers.push(user);
        } else {
            repeatUsers +=1
        }
    }

    console.log(repeatUsers);
    console.log(uniqueUsers);

    fs.writeFileSync('data/uniqueWinterUsers.json', JSON.stringify(uniqueWinterUsers));
}

pruneUsers().catch(e => {
    console.log(e);
})