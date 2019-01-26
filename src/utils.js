const sleep = require('await-sleep')

const isRunning = (pid) => {
  try {
    return process.kill(pid,0)
  } catch (e) {
    return e.code === 'EPERM'
  }
}

const waitForProc = async (pid) => {
  while (isRunning(pid)) {
    await sleep(5000)
  }
}

module.exports = { isRunning, waitForProc }
