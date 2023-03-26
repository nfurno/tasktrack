resource "aws_cognito_user_pool" "this" {
  name = "${var.project_name}-user-pool"

  admin_create_user_config {
    allow_admin_create_user_only = true
  }

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }
}

resource "aws_cognito_user_pool_client" "this" {
  name         = "${var.project_name}-user-pool-client"
  user_pool_id = aws_cognito_user_pool.this.id
}

resource "aws_cognito_user_pool_domain" "this" {
  domain       = "${var.project_name}-${random_string.this.result}.auth.${var.aws_region}.amazoncognito.com"
  user_pool_id = aws_cognito_user_pool.this.id
}

resource "random_string" "this" {
  length  = 6
  special = false
}