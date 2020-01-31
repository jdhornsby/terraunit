const express = require('express');
const bodyParser = require('body-parser');
const defaultMocks = require('./data/default-mocks.json');
const {isDebugModeOn} = require('./utils');

function Mock(options = {}) {
    this.port = options.port || 9999;
    this.mockAwsResponses = options.mockAwsResponses || [];
    this.debugMode = options.debugMode || DEBUG_MODE.LOCAL;

    this.app = express();
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.route('*').all((req, res) => {
        const mockId = req.path.replace(/\//g, '') + ':' + (req.body && req.body.Action ? req.body.Action : '');
        const mockResponse =
            this.mockAwsResponses.find(m => m.id == mockId) ||
            defaultMocks.find(m => m.id == mockId) ||
            this.mockAwsResponses.find(m => m.id == 'default') ||
            defaultMocks.find(m => m.id == 'default');

        if(isDebugModeOn(this.debugMode)) {
            console.log('Mock API received action ' + mockId + ', used mockResponse ' + mockResponse.id);;
        }
        
        res.statusCode = mockResponse.statusCode;
        res.setHeader('Content-Type', 'application/xml');
        res.send(mockResponse.body);
    });
    this.start = () => {
        this.server = this.app.listen(this.port);
    };
    this.stop = async () => {
        await this.server.close();
    };
};

module.exports = Mock;