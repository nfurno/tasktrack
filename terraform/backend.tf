terraform {
  backend "s3" {
    bucket         = "nf-terraform-states"
    key            = "tasktrack-terraform.tfstate"
    region         = "us-east-2"
    dynamodb_table = "nf-terraform-lock"
  }
}