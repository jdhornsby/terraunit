const express = require('express');
const bodyParser = require('body-parser');
const defaultMocks = require('./data/default-mocks.json');

function Mock(options) {
    const {port = 9999, mocks = defaultMocks} = options || {};
    this.port = port;
    this.app = express();
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.route('*').all((req, res) => {
        const mockId = req.path.replace(/\//g, '') + ':' + (req.body && req.body.Action ? req.body.Action : '');
        const mockResponse =
            mocks.find(m => m.id == mockId) ||
            defaultMocks.find(m => m.id == mockId) ||
            mocks.find(m => m.id == 'default') ||
            defaultMocks.find(m => m.id == 'default');

        if(mockResponse.id == 'default' && process.env.MOCK_AWS_DEBUG) {
            console.log('No mock for action ' + mockId + '. Using default.');
        }
        
        res.statusCode = mockResponse.statusCode;
        res.setHeader('Content-Type', 'application/xml');
        res.send(mockResponse.body);
    });
    this.start = () => {
        this.server = this.app.listen(port);
    };
    this.stop = async () => {
        await this.server.close();
    };
};

module.exports = Mock;