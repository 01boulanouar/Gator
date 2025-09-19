import { readConfig, setUser } from './config.js'

function main()
{
    setUser("moboulan");
    const cfg = readConfig();
    console.log(cfg);
}

main();