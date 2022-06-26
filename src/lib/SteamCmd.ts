import os from "os";
import download from "download";
import fs from "fs-extra";

import execa from "execa";

export class SteamCmd {
  _bin = '';

  async run(bin: string, args?: string[]) {
    try {
      console.log(`[run] ${bin} ${args ? args.join(" ") : ""}`);
      const { stdout } = await execa(bin, args);
      console.log(`got results ${stdout}`);
      return { success: true, result: stdout };
    } catch (error: unknown) {
      console.log(`oh no..... ${error}`);
      return { success: false, result: error as string };
    }
  }

  async download(appId: string, workshopId: string) {
    if (!this._bin) {
      await this.setup();
    }


    const { result } = await this.run(this._bin, ["+login", "anonymous", "+workshop_download_item", appId, workshopId, "+quit"]);
    const lines = result.split("\n");
    if (lines[lines.length - 1].startsWith('Success. Downloaded item ')) {
      return { success: true }
    }
    // if (['Access Denied', 'Failure'].filter(item => lines[lines.length - 1].includes(item)).length > 0) {
    //   return { success: false, result: "failed to download" };
    // }

    return { success: false, result: lines[lines.length - 1] };
  }

  async setup() {
    if ((await this.run("steamcmd", ["+login", "anonymous", "+quit"])).success) {
      this._bin = "steamcmd";
      return;
    }

    if ((await this.run("./bin/steamcmd.sh", ["+login", "anonymous", "+quit"])).success) {
      this._bin = "./bin/steamcmd.sh";
      return;
    }

    switch (os.platform()) {
      case "darwin":
        await fs.ensureDir("bin");
        await download("https://steamcdn-a.akamaihd.net/client/installer/steamcmd_osx.tar.gz", "bin", { extract: true });
        await fs.remove("./bin/steamcmd_osx.tar.gz");
        await this.run("./bin/steamcmd.sh", ["+login", "anonymous", "+quit"]);
        this._bin = "./bin/steamcmd.sh";
        break;
    }
    console.log("[setup] complete");
  }
}
