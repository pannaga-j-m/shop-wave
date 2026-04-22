terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
  bucket = "shopwave-s3-bucket"
  key    = "shopwave/terraform.tfstate"
  region = "ap-south-1"   # MUST match CLI region
  use_lockfile = true

  }
}

provider "aws" {
  region = var.region
}