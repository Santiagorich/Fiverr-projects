data "aws_vpc" "vpc" { id = var.vpc_id }

data "aws_caller_identity" "current" {}

data "aws_ebs_default_kms_key" "current" {}

data "aws_kms_key" "ebs" {
  key_id = data.aws_ebs_default_kms_key.current.key_arn
}

data "aws_ami" "win_image" {
  most_recent = true
  name_regex  = "usm1-ami-windows"
  owners      = ["435931445333"]

  filter {
    name   = "name"
    values = ["usm1-ami-windows-server-2012-R2-*"]
  }

  filter {
    name   = "root-device-type"
    values = ["ebs"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

data "template_file" "bootscript" {
  template = file("${path.module}/bootscript.tpl")
  vars = {
    user_secret             = "cwi/internal/user/local/cwi-ansible/credentials"
    region                  = var.region
    cwihostnamevalue        = upper(var.hostname)
  }
}