variable "project_name" {
  description = "The name of the project"
}

variable "lambda_zip_path" {
  description = "The path to the Lambda function deployment package (ZIP file)"
}

variable "dynamodb_table_name" {
  description = "The name of the DynamoDB table used by the application"
}