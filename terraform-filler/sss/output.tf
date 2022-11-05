# Terraform output values
output "ec2_private_ips" {
  value = module.ec2.ec2_private_ips
}

output "ec2_instance_ids" {
  value = module.ec2.ec2_instance_ids
}