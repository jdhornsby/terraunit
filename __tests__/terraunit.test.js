const Terraunit = require('../terraunit');

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
    expect(result.find(r => r.type == 'aws_ssm_parameter' && r.name == 'foo' && r.values && r.values.value == 'bar')).toBeTruthy();
});

test('I can test a Terraform plan with a module.', async () => {
    const result = await terraunit.plan({
        configurations: [{
            mockProviderType: 'aws'  
        },
        {
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
    expect(result.find(r => r.type == 'aws_ssm_parameter' && r.name == 'foo' && r.values && r.values.value == 'bar')).toBeTruthy();
});

test('I can test a Terraform plan with a module with provider overriding.', async () => {
    const result = await terraunit.plan({
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
                    aws.a = aws.x
                }
            }
            `
        },
        {
            mockProviderType: 'aws',
            mockProviderAlias: 'x'
        }]
    });
    expect(result.find(r => r.type == 'aws_ssm_parameter' && r.name == 'foo' && r.values && r.values.value == 'bar')).toBeTruthy();
});

afterAll(async () => {
    terraunit.stop();
});