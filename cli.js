#!/usr/bin/env node

const prompts = require('prompts');
const commandLineArgs = require('command-line-args');
const fs = require('fs');
const moment = require('moment');
const { spawn, execSync } = require('child_process');

run();

async function run() {
  try {
    const options = commandLineArgs([
      { name: 'push', type: String },
      { name: 'pushType', type: String },
      { name: 'mode', type: String, defaultValue: 'dev' },
      { name: 'gitlog', type: Number },
      { name: 'gitgrep', type: String, defaultValue: '' },
      { name: 'env', type: String, defaultValue: '' }
    ]);
    const { push, mode, gitlog, gitgrep, env, pushType } = options;
    if (mode === 'prod') {
      // Confirm prod
      const response = await prompts({
        type: 'text',
        name: 'value',
        message: 'Would you want to do this (y/n)?'
      });
      if (response.value !== 'y') {
        console.log(`>> Cancel`);
        return;
      }
    }

    // Code push
    if (push && mode) {
      let packageData = fs.readFileSync('./package.json');
      packageData = JSON.parse(packageData);
      const { codePushInfo } = packageData;
      if (!codePushInfo || (!codePushInfo.ios && !codePushInfo.android)) {
        console.log('Not found code push info');
        return;
      }
      const appCenterProject = push === 'android' ? codePushInfo.android : codePushInfo.ios;
      let command = `code-push release-react ${appCenterProject} ${push} -m`;
      if (pushType === 'appcenter') command = `appcenter codepush release-react -a ${appCenterProject} -d Staging`;

      // Prod mode
      if (mode === 'prod') {
        command = `code-push promote ${appCenterProject} Staging Production`;

        // Push with appcenter
        if (pushType === 'appcenter') command = `appcenter codepush promote -a ${appCenterProject} -d Production -s Staging`;
      } else {
        const filePath = './src/consts/AppConst.js';
        let res = fs.readFileSync(filePath, 'utf8');
        const index = res.indexOf('PATCH:');
        const index1 = res.indexOf("'", index + 1);
        const index2 = res.indexOf("'", index1 + 1);
        const oldPatch = res.substring(index1 + 1, index2);
        res = res.replace(oldPatch, moment().format('DDMMYY_HHmm'));
        fs.writeFileSync(filePath, res, 'utf8');

        // Save changelog
        await spawnCMD('node cli --gitlog 20');
      }

      // Push
      await spawnCMD(command);
    }

    // Get git log
    if (gitlog) {
      const cmd = `git log -n ${gitlog} --grep="${gitgrep}" --pretty=format:%s`;
      let logs = execSync(cmd).toString();
      console.log('Read git log: ', cmd);
      logs = logs.split('\n');
      logs = logs.filter(
        (item) =>
          item.toLowerCase().indexOf('merge') !== 0 &&
          item.toLowerCase().indexOf('#') !== 0 &&
          item.toLowerCase().indexOf('*') !== 0 &&
          item.toLowerCase().indexOf('!') !== 0
      );
      fs.writeFileSync('./changelog.json', JSON.stringify(logs, null, 2), 'utf8');
    }

    // Update env
    if (env) {
      const defaultEnvData = fs.readFileSync('env/default.env', 'utf8');
      const envPath = env === 'prod' ? 'prod.env' : 'dev.env';
      const envData = fs.readFileSync(`env/${envPath}`, 'utf8');
      const data = defaultEnvData + '\n\n' + envData;
      fs.writeFileSync('.env', data, 'utf8');
    }
  } catch (err) {
    console.log('ERROR', err && (err.message || err.error));
  }
}

function spawnCMD(command) {
  console.log(`$: ${command}`);
  const array = command.split(' ');
  const params = array.filter((e, i) => i > 0);
  const promise = new Promise((resolve, reject) => {
    const process = spawn(array[0], params, { stdio: 'inherit' });
    process.on('exit', (code) => {
      if (code === 0) resolve(code);
      else reject(code);
    });
  });
  return promise;
}
