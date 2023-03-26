output "api_gateway_url" {
  description = "The URL of the API Gateway REST API"
  value       = aws_api_gateway_rest_api.this.url
}