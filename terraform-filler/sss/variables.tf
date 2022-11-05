variable "prefix" {
  type = string
}

variable "suffix" {
  type = string
}

variable "region" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "iam_policy_arns" {
  type = list(string)
  default = []
}

variable "iam_role_existing" {
  type = string
}

variable "hostname" {
  type = string
}

variable "tags" {
  default     = {}
  description = "User-Defined tags"
  type        = map(string)
}

