variable "aws_region" {
  description = "The AWS region where the resources will be created"
  default     = "us-east-2" # Replace this with your desired AWS region
}

provider "aws" {
  region = var.aws_region
}

locals {
  project_name = "tasktrack"
}

# Backend (AWS Lambda & API Gateway)
module "backend" {
  source = "./modules/backend"
  lambda_zip_path = "${path.module}/../lambda/lambda-deployment-package.zip"
  project_name = local.project_name
  dynamodb_table_name = var.dynamodb_table_name
}

# Database (Amazon DynamoDB)
module "database" {
  source             = "./modules/database"
  dynamodb_table_name = var.dynamodb_table_name
}

# Authentication (AWS Cognito User Pools)
module "authentication" {
  source = "./modules/authentication"
  project_name = local.project_name
  aws_region = var.aws_region
}

# Frontend (Amazon S3 & CloudFront)
module "frontend" {
  source             = "./modules/frontend"
  frontend_bucket_name = var.frontend_bucket_name
  ssl_certificate_arn  = var.ssl_certificate_arn
}