terraform {
  backend "s3" {
    encrypt        = true
    region         = "test"
    bucket         = "test"
    dynamodb_table = "test"
    key            = "test"
  }
}