const ci = require('ci-info');

DEBUG_MODE = {
    ALL: 'ALL',
    CI: 'CI',
    LOCAL: 'LOCAL',
    OFF: 'OFF'
};

const isDebugModeOn = (options) => {
    let _debugMode = this.debugMode || DEBUG_MODE.LOCAL;

    if (process.env.TERRAUNIT_DEBUG) _debugMode = process.env.TERRAUNIT_DEBUG;

    if (DEBUG_MODE.ALL == _debugMode) return true;
    if (DEBUG_MODE.CI == _debugMode && ci.isCI) return true;
    if (DEBUG_MODE.LOCAL == _debugMode && !ci.isCI) return true;

    return false;
};

module.exports = {
    DEBUG_MODE: DEBUG_MODE,
    isDebugModeOn: isDebugModeOn
};