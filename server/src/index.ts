import { execSync  } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const executableDir = 'bin';
const executableName = 'vaultc-x86_64-pc-windows-msvc-v0.14.0.exe';

const saveDir = 'data';
const saveName = 'sample.sav';

const isWin = process.platform === "win32";

const main = async () => {
  const stdout = '';

  if (isWin) {
    await execSync(`${path.join(executableDir, executableName)} unpack ${path.join(saveDir, saveName)} ${uuidv4()}`).toString();
  } else {
    await execSync(`xvfb-run wine ${path.join(executableDir, executableName)} unpack ${path.join(saveDir, saveName)} ${uuidv4()}`).toString();
  }

  console.log(`stdout: ${stdout}`);
}

main();
