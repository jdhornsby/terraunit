const MockAWS = require('./mock-aws-api');
const fs = require('fs').promises;
const path = require('path');
const execa = require('execa');
const ci = require('ci-info');

Terraunit.DEBUG_MODE = {
    ALL: 'ALL',
    CI: 'CI',
    LOCAL: 'LOCAL',
    OFF: 'OFF'
};

function Terraunit(options) {
    this.mockAws = new MockAWS(options);

    this.start = () => {
        this.mockAws.start();
    };
    
    this.stop = async () => {
        await this.mockAws.stop();
    };
    
    this.plan = async (options) => {
        const {
            workingDirectory = process.cwd(),
            configurations = []
        } = options || {};
    
        for (configuration of configurations) {
            if (!configuration.content) {
                configuration.content = '';
            }
            if (!configuration.fileName) {
                configuration.fileName = 'main.tf';
            }
            if (configuration.mockProviderType === 'aws') {
                configuration.content = await this._getMockAWSProvider(configuration.mockProviderAlias);
            }
        }
    
        const files = new Set();
        try {
            const dir = path.join(workingDirectory, '__terraunit__');
            await fs.mkdir(dir, { recursive: true });
    
            for(configuration of configurations) {
                const filePath = path.join(dir, configuration.fileName);
                const subdir = path.dirname(filePath);
                if(subdir) {
                    await fs.mkdir(subdir, { recursive: true });
                }
                await fs.appendFile(filePath, configuration.content);
                files.add(filePath);
            }
            
            const debug = this._isDebugOn();

            let result = await execa.command('terraform init', { cwd: dir, env: {TF_LOG: debug ? 'TRACE' : ''} });
            if(debug && result.stdout) console.log(result.stdout);
    
            result = await execa.command('terraform validate', { cwd: dir, env: {TF_LOG: debug ? 'TRACE' : ''} });
            if(debug && result.stdout) console.log(result.stdout);
    
            result = await execa.command('terraform plan -out _plan', { cwd: dir, env: {TF_LOG: debug ? 'TRACE' : ''} });
            if(debug && result.stdout) console.log(result.stdout);
    
            result = await execa.command('terraform show -json _plan', { cwd: dir, env: {TF_LOG: debug ? 'TRACE' : ''} });
            if(debug && result.stdout) console.log(result.stdout);
    
            files.add(path.join(dir, '_plan'));

            const plan = JSON.parse(result.stdout);
            return {
                plan: plan,
                find: (matcher) => {
                    const context = {};
                    _find(plan, matcher, context);
                    return context.result;
                }
            };
        } finally {
            for(file of files) {
                await fs.unlink(file);
            }
        }
    };

    this._getMockAWSProvider = async (alias) => {
        let template = await fs.readFile(path.join(__dirname, 'data/mock-aws-provider.template'), 'utf-8');
        if(alias) {
            alias = `alias                       = "${alias}"`;
        } else {
            alias = '';
        }
        template = template.replace(/\$\{alias\}/g, alias);
        template = template.replace(/\$\{port\}/g, this.mockAws.port);
        return template;
    };

    this._isDebugOn = () => {
        let _debugMode = this.debugMode || Terraunit.DEBUG_MODE.LOCAL;

        if (process.env.TERRAUNIT_DEBUG) _debugMode = process.env.TERRAUNIT_DEBUG;
    
        if (Terraunit.DEBUG_MODE.ALL == _debugMode) return true;
        if (Terraunit.DEBUG_MODE.CI == _debugMode && ci.isCI) return true;
        if (Terraunit.DEBUG_MODE.LOCAL == _debugMode && !ci.isCI) return true;
    
        return false;
    }
};

const _find = (o, matcher, context) => {
    if(!o) {
        return;
    }

    if(matcher(o)) {
        context.result = o;
    } else if(Array.isArray(o)) {
        for(i of o) {
            if(typeof i === 'object') {
                _find(i, matcher, context);
            }
        }
    } else if(typeof o === 'object') {
        for(key of Object.keys(o)) {
            if(typeof o[key] === 'object') {
                _find(o[key], matcher, context);
            }
        }
    }
};

module.exports = Terraunit;