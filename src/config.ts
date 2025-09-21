import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
    dbUrl: string,
    currentUserName: string
};

function getConfigFilePath(): string {
    const configName = ".gatorconfig.json"
    return path.join(os.homedir(), configName);
};


function validateConfig(rawConfig: any): Config {
    if (typeof rawConfig.dbUrl !== "string" && typeof rawConfig.currentUserName !== "string")
        throw new Error("Invalid config file");  
    return rawConfig as Config;
}


export function setUser(username: string) {
    const cfg = readConfig();
    cfg.currentUserName = username;
    writeConfig(cfg);
}; 

export function readConfig(): Config {
    const configPath = getConfigFilePath();
    const configFile = fs.readFileSync(configPath, {encoding: "utf-8"});
    const rawConfig = JSON.parse(configFile);
    const config = validateConfig(rawConfig);
    return config;
};

function writeConfig(cfg: Config): void {
    const configPath = getConfigFilePath();
    const data = JSON.stringify(cfg);
    fs.writeFileSync(configPath, data);
};


