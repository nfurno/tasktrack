resource "aws_s3_bucket" "frontend" {
  bucket = var.frontend_bucket_name
  acl    = "private"

  tags = {
    Name = var.frontend_bucket_name
  }
}

resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:GetObject",
        ]
        Effect = "Allow"
        Resource = "${aws_s3_bucket.frontend.arn}/*"
        Principal = {
          AWS = [aws_cloudfront_origin_access_identity.this.iam_arn]
        }
      }
    ]
  })
}

resource "aws_cloudfront_origin_access_identity" "this" {
}

resource "aws_cloudfront_distribution" "frontend" {
  enabled          = true
  is_ipv6_enabled  = true
  comment          = var.frontend_bucket_name

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "frontend-origin"

    forwarded_values {
      query_string = false
      headers      = ["Origin"]

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
  }

  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = "frontend-origin"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.this.cloudfront_access_identity_path
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = var.ssl_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2018"
  }
}