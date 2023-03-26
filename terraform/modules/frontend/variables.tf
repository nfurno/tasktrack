variable "frontend_bucket_name" {
  description = "The name of the S3 bucket used to store the frontend files"
}

variable "ssl_certificate_arn" {
  description = "The ARN of the ACM SSL certificate for the frontend"
}

variable "web_app_build_path" {
  
}