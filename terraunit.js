const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const execa = require('execa');
const ci = require('ci-info');
const del = require('del');

const _getMockAWSProvider = (alias) => {
    if(alias) {
        alias = `alias                       = "${alias}"`;
    }
    return `
provider "aws" {
    ${alias}
    region                      = "us-east-1"
    skip_credentials_validation = true
    skip_requesting_account_id  = true
    skip_metadata_api_check     = true
    s3_force_path_style         = true
    access_key                  = "mock_access_key"
    secret_key                  = "mock_secret_key"
    
    endpoints {
        accessanalyzer         = "http://localhost:9999"
        acm                    = "http://localhost:9999"
        acmpca                 = "http://localhost:9999"
        amplify                = "http://localhost:9999"
        apigateway             = "http://localhost:9999"
        applicationautoscaling = "http://localhost:9999"
        applicationinsights    = "http://localhost:9999"
        appmesh                = "http://localhost:9999"
        appstream              = "http://localhost:9999"
        appsync                = "http://localhost:9999"
        athena                 = "http://localhost:9999"
        autoscaling            = "http://localhost:9999"
        autoscalingplans       = "http://localhost:9999"
        backup                 = "http://localhost:9999"
        batch                  = "http://localhost:9999"
        budgets                = "http://localhost:9999"
        cloud9                 = "http://localhost:9999"
        cloudformation         = "http://localhost:9999"
        cloudfront             = "http://localhost:9999"
        cloudhsm               = "http://localhost:9999"
        cloudsearch            = "http://localhost:9999"
        cloudtrail             = "http://localhost:9999"
        cloudwatch             = "http://localhost:9999"
        cloudwatchevents       = "http://localhost:9999"
        cloudwatchlogs         = "http://localhost:9999"
        codebuild              = "http://localhost:9999"
        codecommit             = "http://localhost:9999"
        codedeploy             = "http://localhost:9999"
        codepipeline           = "http://localhost:9999"
        cognitoidentity        = "http://localhost:9999"
        cognitoidp             = "http://localhost:9999"
        configservice          = "http://localhost:9999"
        cur                    = "http://localhost:9999"
        dataexchange           = "http://localhost:9999"
        datapipeline           = "http://localhost:9999"
        datasync               = "http://localhost:9999"
        dax                    = "http://localhost:9999"
        devicefarm             = "http://localhost:9999"
        directconnect          = "http://localhost:9999"
        dlm                    = "http://localhost:9999"
        dms                    = "http://localhost:9999"
        docdb                  = "http://localhost:9999"
        ds                     = "http://localhost:9999"
        dynamodb               = "http://localhost:9999"
        ec2                    = "http://localhost:9999"
        ecr                    = "http://localhost:9999"
        ecs                    = "http://localhost:9999"
        efs                    = "http://localhost:9999"
        eks                    = "http://localhost:9999"
        elasticache            = "http://localhost:9999"
        elasticbeanstalk       = "http://localhost:9999"
        elastictranscoder      = "http://localhost:9999"
        elb                    = "http://localhost:9999"
        emr                    = "http://localhost:9999"
        es                     = "http://localhost:9999"
        firehose               = "http://localhost:9999"
        fms                    = "http://localhost:9999"
        forecast               = "http://localhost:9999"
        fsx                    = "http://localhost:9999"
        gamelift               = "http://localhost:9999"
        glacier                = "http://localhost:9999"
        globalaccelerator      = "http://localhost:9999"
        glue                   = "http://localhost:9999"
        guardduty              = "http://localhost:9999"
        greengrass             = "http://localhost:9999"
        iam                    = "http://localhost:9999"
        imagebuilder           = "http://localhost:9999"
        inspector              = "http://localhost:9999"
        iot                    = "http://localhost:9999"
        iotanalytics           = "http://localhost:9999"
        iotevents              = "http://localhost:9999"
        kafka                  = "http://localhost:9999"
        kinesis                = "http://localhost:9999"
        kinesisanalytics       = "http://localhost:9999"
        kinesisvideo           = "http://localhost:9999"
        kms                    = "http://localhost:9999"
        lakeformation          = "http://localhost:9999"
        lambda                 = "http://localhost:9999"
        lexmodels              = "http://localhost:9999"
        licensemanager         = "http://localhost:9999"
        lightsail              = "http://localhost:9999"
        macie                  = "http://localhost:9999"
        managedblockchain      = "http://localhost:9999"
        marketplacecatalog     = "http://localhost:9999"
        mediaconnect           = "http://localhost:9999"
        mediaconvert           = "http://localhost:9999"
        medialive              = "http://localhost:9999"
        mediapackage           = "http://localhost:9999"
        mediastore             = "http://localhost:9999"
        mediastoredata         = "http://localhost:9999"
        mq                     = "http://localhost:9999"
        neptune                = "http://localhost:9999"
        opsworks               = "http://localhost:9999"
        organizations          = "http://localhost:9999"
        personalize            = "http://localhost:9999"
        pinpoint               = "http://localhost:9999"
        pricing                = "http://localhost:9999"
        qldb                   = "http://localhost:9999"
        quicksight             = "http://localhost:9999"
        ram                    = "http://localhost:9999"
        rds                    = "http://localhost:9999"
        redshift               = "http://localhost:9999"
        resourcegroups         = "http://localhost:9999"
        route53                = "http://localhost:9999"
        route53resolver        = "http://localhost:9999"
        s3                     = "http://localhost:9999"
        s3control              = "http://localhost:9999"
        sagemaker              = "http://localhost:9999"
        sdb                    = "http://localhost:9999"
        secretsmanager         = "http://localhost:9999"
        securityhub            = "http://localhost:9999"
        serverlessrepo         = "http://localhost:9999"
        servicecatalog         = "http://localhost:9999"
        servicediscovery       = "http://localhost:9999"
        servicequotas          = "http://localhost:9999"
        ses                    = "http://localhost:9999"
        shield                 = "http://localhost:9999"
        sns                    = "http://localhost:9999"
        sqs                    = "http://localhost:9999"
        ssm                    = "http://localhost:9999"
        stepfunctions          = "http://localhost:9999"
        storagegateway         = "http://localhost:9999"
        sts                    = "http://localhost:9999"
        swf                    = "http://localhost:9999"
        transfer               = "http://localhost:9999"
        waf                    = "http://localhost:9999"
        wafregional            = "http://localhost:9999"
        wafv2                  = "http://localhost:9999"
        worklink               = "http://localhost:9999"
        workspaces             = "http://localhost:9999"
        xray                   = "http://localhost:9999"
    }
    }
`;
};

const _debugOn = (debugMode) => {
    if (process.env.TERRAUNIT_DEBUG) debugMode = process.env.TERRAUNIT_DEBUG;
    
    if (Terraunit.DEBUG_MODE.ALL == debugMode) return true;
    if (Terraunit.DEBUG_MODE.CI == debugMode && ci.isCI) return true;
    if (Terraunit.DEBUG_MODE.LOCAL == debugMode && !ci.isCI) return true;

    return false;
};

function Terraunit() {

};

Terraunit.DEBUG_MODE = {
    ALL: 'ALL',
    CI: 'CI',
    LOCAL: 'LOCAL',
    OFF: 'OFF'
};

Terraunit.prototype.start = (options) => {
    const {port = 9999} = options || {};
    this.server = http.createServer();
    this.server.on('request', async (req, res) => {
        res.writeHead(401, {
            'Content-Type': 'application/xml'
        });
        res.write('<?xml version="1.0" encoding="UTF-8"?><Response><Errors><Error><Code>AuthFailure</Code><Message>This is a mock endpoint!</Message></Error></Errors><RequestID>dfb4b595-9956-4b63-9cf1-572bd46804a4</RequestID></Response>');
        res.end();
    });
    this.server.listen(port || 9999);
};

Terraunit.prototype.stop = async () => {
    return new Promise(resolve => {
        this.server.close(resolve);
    });
};

Terraunit.prototype.plan = async (options) => {
    const {
        workingDirectory = process.cwd(),
        configurations = [],
        providers = [{
            type: 'aws',
            alias: '',
            fileName: 'providers.tf'
        }],
        debugMode = Terraunit.DEBUG_MODE.LOCAL
    } = options || {};

    for(provider of providers) {
        if (provider.type == 'aws' && !provider.content) {
            provider.content = _getMockAWSProvider(provider.alias);
        }
    }

    const debug = _debugOn(debugMode);

    const dir = path.join(workingDirectory, '__terraunit__');
    try {
        await fs.mkdir(dir, { recursive: true });

        const terraform = configurations.concat(providers);
        for(tf of terraform) {
            const {fileName = 'main.tf'} = tf;
            const filePath = path.join(dir, fileName);
            const subdir = path.dirname(filePath);
            if(subdir) {
                await fs.mkdir(subdir, { recursive: true });
            }
            await fs.appendFile(filePath, tf.content);
        }

        let result = await execa.command('terraform init', { cwd: dir, env: {TF_LOG: debug ? 'TRACE' : ''} });
        if(debug && result.stdout) console.log(result.stdout);

        result = await execa.command('terraform validate', { cwd: dir, env: {TF_LOG: debug ? 'TRACE' : ''} });
        if(debug && result.stdout) console.log(result.stdout);

        result = await execa.command('terraform plan -out _plan', { cwd: dir, env: {TF_LOG: debug ? 'TRACE' : ''} });
        if(debug && result.stdout) console.log(result.stdout);

        result = await execa.command('terraform show -json _plan', { cwd: dir, env: {TF_LOG: debug ? 'TRACE' : ''} });
        if(debug && result.stdout) console.log(result.stdout);

        return JSON.parse(result.stdout);
    } finally {
        if(ci.isCI) {
            await fs.rmdir(dir, { recursive: true });
        } else {
            await del([dir + '/*', '!*/.terraform']);
        }
    }
};

module.exports = Terraunit;