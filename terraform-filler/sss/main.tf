module "ec2" {
  source      = "git@github.com:caseware/cwi-int-infra-library.git//ec2?ref=ec2-2.1.0"
  public_key  = ""
  create_sg   = false  
  vpc_id      = data.aws_vpc.vpc.id

  ec2_instances = [
    {
      name                                = var.hostname
      ami_id                              = data.aws_ami.win_image.image_id
      instance_type                       = "test"
      elastic_ip                          = false
      ebs_optimized                       = true
      detailed_monitoring                 = true
      termination_protection              = false
      key_name                            = "test"
      existing_iam_instance_profile_name  = var.iam_role_existing
      subnet_id                           = "test"
      existing_sg_id                      = "test"
      additional_sg_ids                   = ["test"]
      user_data                           = data.template_file.bootscript.rendered
      root_volume_size                    = 100
      root_volume_type                    = "gp2"
      root_volume_delete_on_termination   = true
      root_volume_encrypted               = true
      root_volume_kms_key_arn             = data.aws_kms_key.ebs.arn
      root_volume_tags                    = var.tags
      add_route53                         = false
    }
  ]
  ebs_volumes = [
    {
      encrypted   = true
      size        = "test"
      type        = "gp2"
      kms_key_arn = data.aws_kms_key.ebs.arn
      device_name = "test"
      snapshot_id = "test"
      volume_tags = merge(var.tags,
      {
        "cwi:backup:enable" = "true",
        "cwi:backup:retentionDays" = 90,
        "cwi:backup:schedule" = 0
      })

    }
  ]
  tags = var.tags
}