const Terraunit = require('../terraunit');

const terraunit = new Terraunit();

jest.setTimeout(60000); // Terraform can take a bit to run a plan...

beforeAll(() => {
    terraunit.start();
});

test('I can test a Terraform plan.', async () => {
    const plan = await terraunit.plan({
        configurations: [{
            content: `resource "aws_ssm_parameter" "foo" {
                name  = "foo"
                type  = "String"
                value = "bar"
            }`
        }]
    });
    expect(plan.planned_values.root_module.resources[0].name).toBe('foo');
    expect(plan.planned_values.root_module.resources[0].values.value).toBe('bar');
});

test('I can test a Terraform plan with a module.', async () => {
    const plan = await terraunit.plan({
        configurations: [{
            fileName: 'module/main.tf',
            content: `resource "aws_ssm_parameter" "foo" {
                    name  = "foo"
                    type  = "String"
                    value = "bar"
                }`
        },
        {
            fileName: 'main.tf',
            content: `module "test" {
                source = "./module"
            }
            `
        }]
    });
    expect(plan.planned_values.root_module.child_modules[0].resources[0].name).toBe('foo');
    expect(plan.planned_values.root_module.child_modules[0].resources[0].values.value).toBe('bar');
});

test('I can test a Terraform plan with a module with provider overriding.', async () => {
    const plan = await terraunit.plan({
        configurations: [{
            fileName: 'module/main.tf',
            content: `provider "aws" {
                    alias = "a"
                }
            
                resource "aws_ssm_parameter" "foo" {
                    provider = aws.a
                    name  = "foo"
                    type  = "String"
                    value = "bar"
                }`
        },
        {
            fileName: 'main.tf',
            content: `module "test" {
                source = "./module"
                providers = {
                    aws.a = "aws.x"
                }
            }
            `
        }],
        providers: [{
            type: 'aws',
            alias: 'x',
            fileName: 'providers.tf'
        }]
    });
    expect(plan.planned_values.root_module.child_modules[0].resources[0].name).toBe('foo');
    expect(plan.planned_values.root_module.child_modules[0].resources[0].values.value).toBe('bar');
});

afterAll(async () => {
    terraunit.stop();
});