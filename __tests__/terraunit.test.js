const Terraunit = require('../terraunit');

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
        ],
        debug: true
    });
    expect(plan.planned_values.root_module.resources[0].name).toBe('foo');
    expect(plan.planned_values.root_module.resources[0].values.value).toBe('bar');
});

afterAll(async () => {
    terraunit.stop();
});