
import argparse
import os

files = [
  {
    "filename": "backend.tf",
    "template": "terraform {\n  backend \"s3\" {\n    encrypt        = true\n    region         = \"$$var_region$$\"\n    bucket         = \"$$var_bucket$$\"\n    dynamodb_table = \"$$var_dynamodb_table$$\"\n    key            = \"$$var_key$$\"\n  }\n}"
  },
  {
    "filename": "data.tf",
    "template": "data \"aws_vpc\" \"vpc\" { id = var.vpc_id }\n\ndata \"aws_caller_identity\" \"current\" {}\n\ndata \"aws_ebs_default_kms_key\" \"current\" {}\n\ndata \"aws_kms_key\" \"ebs\" {\n  key_id = data.aws_ebs_default_kms_key.current.key_arn\n}\n\ndata \"aws_ami\" \"win_image\" {\n  most_recent = true\n  name_regex  = \"usm1-ami-windows\"\n  owners      = [\"435931445333\"]\n\n  filter {\n    name   = \"name\"\n    values = [\"usm1-ami-windows-server-2012-R2-*\"]\n  }\n\n  filter {\n    name   = \"root-device-type\"\n    values = [\"ebs\"]\n  }\n\n  filter {\n    name   = \"virtualization-type\"\n    values = [\"hvm\"]\n  }\n}\n\ndata \"template_file\" \"bootscript\" {\n  template = file(\"${path.module}/bootscript.tpl\")\n  vars = {\n    user_secret             = \"cwi/internal/user/local/cwi-ansible/credentials\"\n    region                  = var.region\n    cwihostnamevalue        = upper(var.hostname)\n  }\n}"
  },
  {
    "filename": "iam.tf",
    "template": "# TF Configuration to create IAM role to SE Tomcat Ec2\n\ndata \"aws_iam_policy_document\" \"sss\" {\n  statement {\n    actions = [\n      \"secretsmanager:GetSecretValue\"\n    ]\n    resources = [\n      \"arn:aws:secretsmanager:${var.region}:${data.aws_caller_identity.current.account_id}:secret:cwi/internal/*\",\n    ]\n  }\n}\n\nresource \"aws_iam_instance_profile\" \"instance_profile\" {\n  name = format(\"%s-profile-%s\", var.prefix, var.suffix)\n  role = var.iam_role_existing\n}\n\n"
  },
  {
    "filename": "main.tf",
    "template": "module \"ec2\" {\n  source      = \"git@github.com:caseware/cwi-int-infra-library.git//ec2?ref=ec2-2.1.0\"\n  public_key  = \"\"\n  create_sg   = false  \n  vpc_id      = data.aws_vpc.vpc.id\n\n  ec2_instances = [\n    {\n      name                                = var.hostname\n      ami_id                              = data.aws_ami.win_image.image_id\n      instance_type                       = \"$$var_instance_type$$\"\n      elastic_ip                          = false\n      ebs_optimized                       = true\n      detailed_monitoring                 = true\n      termination_protection              = false\n      key_name                            = \"$$var_key_name$$\"\n      existing_iam_instance_profile_name  = var.iam_role_existing\n      subnet_id                           = \"$$var_subnet_id$$\"\n      existing_sg_id                      = \"$$var_sg_id$$\"\n      additional_sg_ids                   = [\"$$var_additional_sg_id$$\"]\n      user_data                           = data.template_file.bootscript.rendered\n      root_volume_size                    = 100\n      root_volume_type                    = \"gp2\"\n      root_volume_delete_on_termination   = true\n      root_volume_encrypted               = true\n      root_volume_kms_key_arn             = data.aws_kms_key.ebs.arn\n      root_volume_tags                    = var.tags\n      add_route53                         = false\n    }\n  ]\n  ebs_volumes = [\n    {\n      encrypted   = true\n      size        = \"$$var_ebs_size$$\"\n      type        = \"gp2\"\n      kms_key_arn = data.aws_kms_key.ebs.arn\n      device_name = \"$$var_ebs_device_name$$\"\n      snapshot_id = \"$$var_ebs_snapshot_id$$\"\n      volume_tags = merge(var.tags,\n      {\n        \"cwi:backup:enable\" = \"true\",\n        \"cwi:backup:retentionDays\" = 90,\n        \"cwi:backup:schedule\" = 0\n      })\n\n    }\n  ]\n  tags = var.tags\n}"
  },
  {
    "filename": "output.tf",
    "template": "# Terraform output values\noutput \"ec2_private_ips\" {\n  value = module.ec2.ec2_private_ips\n}\n\noutput \"ec2_instance_ids\" {\n  value = module.ec2.ec2_instance_ids\n}"
  },
  {
    "filename": "providers.tf",
    "template": "#Terraform File to create SE instance\nprovider \"aws\" {\n  region = var.region\n}"
  },
  {
    "filename": "terraform.tfvars",
    "template": "#Config variables\nhostname          = \"$$var_hostname$$\"\niam_role_existing = \"$$var_iam_role_existing$$\"\nprefix            = \"$$var_prefix$$\"\nsuffix            = \"$$var_suffix$$\"\nregion            = \"$$var_region$$\"\nvpc_id            = \"$$var_vpc_id$$\"\n\ntags = {\n  \"cwi:creationDate\"   = \"$$var_creation_date$$\"\n  \"cwi:creator\"        = \"$$var_creator$$\"\n  \"cwi:customerRegion\" = \"$$var_customer_region$$\"\n  \"cwi:hostingRegion\"  = \"$$var_hosting_region$$\"\n  \"cwi:reference\"      = \"$$var_reference$$\"\n  \"cwi:requestor\"      = \"$$var_requestor$$\"\n  \"cwi:role\"           = \"app\"\n  \"cwi:taggingVersion\" = \"1.5\"\n  \"cwi:team\"           = \"hc\"\n  \"cwi:owner\"          = \"$$var_owner$$\"\n  \"cwi:platform\"       = \"$$var_platform$$\"\n  \"cwi:type\"           = \"automated\"\n  \"cwi:iac\"            = \"terraform\"\n  \"cwi:iacPath\"        = \"$$var_iac_path$$\"\n  \"cwi:stack\"          = \"sss\"\n}\n\n#AWS Managed polices\niam_policy_arns = [\n  \"arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy\",\n  \"arn:aws:iam::aws:policy/AmazonSSMFullAccess\",\n  \"arn:aws:iam::aws:policy/service-role/AmazonEC2RoleforSSM\",\n  \"arn:aws:iam::aws:policy/AmazonEC2ReadTags\",\n  \"arn:aws:iam::aws:policy/AmazonSesSnsSqsFullAccess\",\n  \"arn:aws:iam::aws:policy/AWSS3ReadAndWritePolicy\",\n]"
  },
  {
    "filename": "variables.tf",
    "template": "variable \"prefix\" {\n  type = string\n}\n\nvariable \"suffix\" {\n  type = string\n}\n\nvariable \"region\" {\n  type = string\n}\n\nvariable \"vpc_id\" {\n  type = string\n}\n\nvariable \"iam_policy_arns\" {\n  type = list(string)\n  default = []\n}\n\nvariable \"iam_role_existing\" {\n  type = string\n}\n\nvariable \"hostname\" {\n  type = string\n}\n\nvariable \"tags\" {\n  default     = {}\n  description = \"User-Defined tags\"\n  type        = map(string)\n}\n\n"
  }
]




def fillTerraformFiles(args):
    if not os.path.exists('sss'):
        os.makedirs('sss')
    for file in files:
        filedata = file['template']
        filedata = filedata.replace('$$var_hostname$$', args.hostname)
        filedata = filedata.replace('$$var_iam_role_existing$$', args.iam_role_existing)
        filedata = filedata.replace('$$var_prefix$$', args.prefix)
        filedata = filedata.replace('$$var_suffix$$', args.suffix)
        filedata = filedata.replace('$$var_vpc_id$$', args.vpc_id)
        filedata = filedata.replace('$$var_creation_date$$', args.creation_date)
        filedata = filedata.replace('$$var_creator$$', args.creator)
        filedata = filedata.replace('$$var_customer_region$$', args.customer_region)
        filedata = filedata.replace('$$var_hosting_region$$', args.hosting_region)
        filedata = filedata.replace('$$var_reference$$', args.reference)
        filedata = filedata.replace('$$var_requestor$$', args.requestor)
        filedata = filedata.replace('$$var_owner$$', args.owner)
        filedata = filedata.replace('$$var_platform$$', args.platform)
        filedata = filedata.replace('$$var_iac_path$$', args.iac_path)
        filedata = filedata.replace('$$var_region$$', args.region)
        filedata = filedata.replace('$$var_bucket$$', args.bucket)
        filedata = filedata.replace('$$var_dynamodb_table$$', args.dynamodb_table)
        filedata = filedata.replace('$$var_key$$', args.key)
        filedata = filedata.replace('$$var_instance_type$$', args.instance_type)
        filedata = filedata.replace('$$var_key_name$$', args.key_name)
        filedata = filedata.replace('$$var_subnet_id$$', args.subnet_id)
        filedata = filedata.replace('$$var_sg_id$$', args.sg_id)
        filedata = filedata.replace('$$var_additional_sg_id$$', args.additional_sg_id)
        filedata = filedata.replace('$$var_ebs_size$$', args.ebs_size)
        filedata = filedata.replace('$$var_ebs_device_name$$', args.ebs_device_name)
        filedata = filedata.replace('$$var_ebs_snapshot_id$$', args.ebs_snapshot_id)
        with open('sss/' + file['filename'], 'w') as f:
            f.write(filedata)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--hostname')
    parser.add_argument('--iam_role_existing')
    parser.add_argument('--prefix')
    parser.add_argument('--suffix')
    parser.add_argument('--vpc_id')
    parser.add_argument('--creation_date')
    parser.add_argument('--creator')
    parser.add_argument('--customer_region')
    parser.add_argument('--hosting_region')
    parser.add_argument('--reference')
    parser.add_argument('--requestor')
    parser.add_argument('--owner')
    parser.add_argument('--platform')
    parser.add_argument('--iac_path')
    parser.add_argument('--region')
    parser.add_argument('--bucket')
    parser.add_argument('--dynamodb_table')
    parser.add_argument('--key')
    parser.add_argument('--instance_type')
    parser.add_argument('--key_name')
    parser.add_argument('--subnet_id')
    parser.add_argument('--sg_id')
    parser.add_argument('--additional_sg_id')
    parser.add_argument('--ebs_size')
    parser.add_argument('--ebs_device_name')
    parser.add_argument('--ebs_snapshot_id')
    fillTerraformFiles(parser.parse_args())

    

# Dummy parameters for testing
# filler.py --hostname test --iam_role_existing test --prefix test --suffix test --region test --vpc_id test --creation_date test --creator test --customer_region test --hosting_region test --reference test --requestor test --owner test --platform test --iac_path test --region test --bucket test --dynamodb_table test --key test --instance_type test --key_name test --subnet_id test --sg_id test --additional_sg_id test --ebs_size test --ebs_device_name test --ebs_snapshot_id test 

