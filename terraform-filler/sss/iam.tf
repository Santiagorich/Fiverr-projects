# TF Configuration to create IAM role to SE Tomcat Ec2

data "aws_iam_policy_document" "sss" {
  statement {
    actions = [
      "secretsmanager:GetSecretValue"
    ]
    resources = [
      "arn:aws:secretsmanager:${var.region}:${data.aws_caller_identity.current.account_id}:secret:cwi/internal/*",
    ]
  }
}

resource "aws_iam_instance_profile" "instance_profile" {
  name = format("%s-profile-%s", var.prefix, var.suffix)
  role = var.iam_role_existing
}

