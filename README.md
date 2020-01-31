# Terraunit

A node.js based helper for unit testing (AWS) Terraform.

## What is Terraunit?

The goal of Terraunit it so enable a really fast, totally local unit testing feedback loop while developing Terraform modules. It is intended to complement integration tests, rather than replace them.

At its core, it is just a simple local mock AWS API and a set of scripts for getting your module to talk to them. You can instatiate your module, run a plan, and then look for expected resources in that plan.

It is currently written in node.js with the intention of integrating with Jest. This is mostly of out convenience and might change in future versions.

## Basic Usage

Installation:
```bash
$ npm install terraunit --save-dev
```

You can write a basic test that invokes a module you've been developing:
```js
//import
const Terraunit = require('terraunit');
const terraunit = new Terraunit();

//plans can take time when fetching resources
jest.setTimeout(60000);

//start and stop the mock aws service
beforeAll(() => {
    terraunit.start();
});
afterAll(async () => {
    terraunit.stop();
});

//write a test
test('I can test a Terraform plan.', async () => {
    //run a plan
    const result = await terraunit.plan({
        //list configs to shim in
        configurations: [
            //add a mock aws provider
            {
                mockProviderType: 'aws'  
            },
            //add a top level invokation of your module
            {
                content: `resource "aws_ssm_parameter" "foo" {
                    name  = "foo"
                    type  = "String"
                    value = "bar"
                }`
            }
        ]
    });

    //search the plan for things you are interested in
    expect(result.find(r => r.type == 'aws_ssm_parameter' && r.name == 'foo')).toBeTruthy();

    //or traverse the plan directly as needed
    const plan = result.plan;
});
```

Typical project folder structure:
```
.
|-- __tests__
|   |-- main.test.js
|-- main.tf
|-- outputs.tf
|-- variables.tf
|-- package.json
```

## API

The constructor takes an (optional) object with the following structure:
```js
const options = {
    //the port to run on, defaults to 9999
    port: 9999,
    //additional AWS API mock responses
    mockAwsResponses: [{
        id: 'sts:AssumeRole',
        statusCode: 200,
        body: '<...>'
    }],
    //debug mode to start with (see Debugging section), defaults to LOCAL mode
    debugMode: 'LOCAL'
}
```

The plan method takes an object with the following structure:
```js
const options = {
    //the root workspace directory, defaults to cwd
    workingDirectory: process.cwd(),
    //an array of terraform configuration objects
    configurations: [{
        //raw terraform configuration data
        content: `...`,
        //the filename to store the config in
        // defaults to main.tf
        fileName: 'main.tf',
        //this configuration is a mock provider
        // will override content with a mock provider of the given type (only aws at this point)
        mockProviderType: 'aws',
        //add an alias to this mock provider
        // defaults to no alias
        mockProviderAlias: ''
    }]
}
```

## Examples

Aliasing providers:
```js
test('I can alias providers.', async () => {
    const result = await terraunit.plan({
        configurations: [{
            mockProviderType: 'aws',
            mockProviderAlias: 'x'
        },
        {
            content: `module "test" {
                source = ".."
                providers = {
                    aws = aws.x
                }
            }`
        }]
    });
});
```

I can override the providers in my module:
```js
test('I can alias providers.', async () => {
    const result = await terraunit.plan({
        configurations: [{
            mockProviderType: 'aws',
            fileName: '../providers_override.tf'
        },
        {
            content: `module "test" {
                source = ".."
                providers = {
                    aws.some_provider = aws
                }
            }`
        }]
    });
});
```

## Debugging

You can configure the debug mode by passing the debugMode argument into the Terraform constructor options. You can also override this by setting the `TERRAUNIT_DEBUG` environment variable.

It supports the following options:
* ALL - Will run in all environments
* LOCAL - Will only run locally
* CI - Will run only during CI
* OFF - Will not run

Debugging will print all terraform command output and API call information to the console.

## Roadmap

* Add mock API responses as needed.
* Add additional methods for searching and filtering through the plan.
* Possibly switch to Go to fit better with the Terraform ecosystem.

## Contributing

Clone the repo:
```bash
$ git clone git@github.com:jdhornsby/terraunit.git
$ cd terraunit
$ npm install
$ npm run test
```

Add your features. Add you test. Send a PR!