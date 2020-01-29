# Terraunit

Defining your infrastructure as code is a generally recognized best practice. Best practices also recognize that automated tests are a must have. Unfortunately, the infrastructure as code ecosystem is immature. There are a number of integration test frameworks such as [Terratest](https://github.com/gruntwork-io/terratest). These are great for making sure your infrastructure deploys correctly, but they are slow. Rapid development requires a tight unit test feedback loop. Enter Terraunit.

Terraunit makes it easy to write [Jest](https://jestjs.io/) tests against a Terraform plan.

```js
const Terraunit = require('terraunit');

const terraunit = new Terraunit();

jest.setTimeout(60000); // Terraform can take a bit to run a plan...

beforeAll(() => {
    terraunit.start();
});

test('I can test a Terraform plan.', async () => {
    const result = await terraunit.plan({
        configurations: [{
            mockProviderType: 'aws'  
        },
        {
            content: `resource "aws_ssm_parameter" "foo" {
                name  = "foo"
                type  = "String"
                value = "bar"
            }`
        }]
    });
    expect(result.find(r => r.type == 'aws_ssm_parameter' && r.name == 'foo')).toBeTruthy();
});

afterAll(async () => {
    terraunit.stop();
});
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
        // will override content with a mock proviedr
        // supports:
        // - aws
        mockProviderType: '',
        //add an alias to this mock provider
        // defaults to no alias
        mockProviderAlias: '',
        //debug mode
        // Supports:
        // - ALL: full debug everywhere
        // - CI: debug during CI only
        // - LOCAL: debug locally only
        // - OFF: no debug
        // defaults to LOCAL
        debugMode: Terraunit.DEBUG_MODE.LOCAL
    }]
}
```