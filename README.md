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
    const plan = await terraunit.plan({
        terraform: [
            `resource "aws_ssm_parameter" "foo" {
                name  = "foo"
                type  = "String"
                value = "bar"
            }`
        ]
    });
    expect(plan.planned_values.root_module.resources[0].name).toBe('foo');
    expect(plan.planned_values.root_module.resources[0].values.value).toBe('bar');
});

afterAll(async () => {
    terraunit.stop();
});
```