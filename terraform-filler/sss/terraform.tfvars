#Config variables
hostname          = "test"
iam_role_existing = "test"
prefix            = "test"
suffix            = "test"
region            = "test"
vpc_id            = "test"

tags = {
  "cwi:creationDate"   = "test"
  "cwi:creator"        = "test"
  "cwi:customerRegion" = "test"
  "cwi:hostingRegion"  = "test"
  "cwi:reference"      = "test"
  "cwi:requestor"      = "test"
  "cwi:role"           = "app"
  "cwi:taggingVersion" = "1.5"
  "cwi:team"           = "hc"
  "cwi:owner"          = "test"
  "cwi:platform"       = "test"
  "cwi:type"           = "automated"
  "cwi:iac"            = "terraform"
  "cwi:iacPath"        = "test"
  "cwi:stack"          = "sss"
}

#AWS Managed polices
iam_policy_arns = [
  "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy",
  "arn:aws:iam::aws:policy/AmazonSSMFullAccess",
  "arn:aws:iam::aws:policy/service-role/AmazonEC2RoleforSSM",
  "arn:aws:iam::aws:policy/AmazonEC2ReadTags",
  "arn:aws:iam::aws:policy/AmazonSesSnsSqsFullAccess",
  "arn:aws:iam::aws:policy/AWSS3ReadAndWritePolicy",
]