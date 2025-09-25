#!/usr/bin/env python3
"""
Script to build a React app and deploy it to AWS S3 with improved error handling
"""

import os
import subprocess
import sys
import boto3
import argparse
import json
import time
from pathlib import Path
from botocore.exceptions import ClientError, NoCredentialsError, BotoCoreError

class ReactS3Deployer:
    def __init__(self, bucket_name, region='us-east-1', profile=None, distribution_id: str = None):
        """
        Initialize the React S3 deployer
        
        Args:
            bucket_name (str): S3 bucket name
            region (str): AWS region
            profile (str): AWS profile name (optional)
        """
        self.bucket_name = bucket_name
        self.region = region
        self.distribution_id = distribution_id
        
        # Set up AWS session
        try:
            session_args = {'region_name': region}
            if profile:
                session_args['profile_name'] = profile
                
            self.session = boto3.Session(**session_args)
            self.s3_client = self.session.client('s3')
            print(f"✓ AWS session created for region: {region}")
            # optional CloudFront distribution id (for cache invalidation)
            self.distribution_id = distribution_id
            
        except (NoCredentialsError, BotoCoreError) as e:
            print(f"✗ AWS credentials error: {e}")
            print("\nPlease configure your AWS credentials using one of these methods:")
            print("1. Run 'aws configure'")
            print("2. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables")
            print("3. Use --profile option with a named profile")
            sys.exit(1)

    def invalidate_cloudfront(self, distribution_id: str = None, paths=None):
        """Create a CloudFront invalidation for the given distribution and paths.

        This method is non-fatal for the deployment: if invalidation fails we
        log a warning and continue.
        """
        if paths is None:
            paths = ['/*']

        dist_id = distribution_id or getattr(self, 'distribution_id', None)
        if not dist_id:
            print("i) No CloudFront distribution id provided — skipping invalidation")
            return True

        try:
            cf = self.session.client('cloudfront')
            caller_ref = str(int(time.time()))
            print(f"Invalidating CloudFront distribution: {dist_id} (paths: {paths})")
            resp = cf.create_invalidation(
                DistributionId=dist_id,
                InvalidationBatch={
                    'Paths': {
                        'Quantity': len(paths),
                        'Items': paths
                    },
                    'CallerReference': caller_ref
                }
            )
            inval_id = resp.get('Invalidation', {}).get('Id')
            print(f"✓ CloudFront invalidation created: {inval_id}")
            return True
        except (ClientError, BotoCoreError) as e:
            print(f"⚠️ CloudFront invalidation failed: {e}")
            return False

    def check_aws_permissions(self):
        """Check if AWS credentials have sufficient permissions"""
        try:
            # Try to list buckets (minimal permission check)
            self.s3_client.list_buckets()
            print("✓ AWS credentials have sufficient permissions")
            return True
        except ClientError as e:
            error_code = e.response['Error']['Code']
            if error_code == 'AccessDenied':
                print("✗ AWS credentials don't have sufficient permissions")
                print("Required permissions: s3:ListBucket, s3:CreateBucket, s3:PutBucketWebsite, s3:PutBucketPolicy, s3:PutObject")
                return False
            else:
                print(f"✗ AWS permissions check failed: {e}")
                return False

    def check_prerequisites(self):
        """Check if Node.js and npm are installed"""
        try:
            node_version = subprocess.run(['node', '--version'], 
                                        capture_output=True, text=True, check=True)
            print(f"✓ Node.js found: {node_version.stdout.strip()}")
            
            npm_version = subprocess.run(['npm', '--version'], 
                                       capture_output=True, text=True, check=True)
            print(f"✓ npm found: {npm_version.stdout.strip()}")
            
            return True
        except (subprocess.CalledProcessError, FileNotFoundError) as e:
            print("✗ Node.js or npm is not installed")
            print("Please install Node.js from https://nodejs.org/")
            return False

    def build_storybook_app(self, react_app_path):
        """Build the Storybook app"""
        try:
            print("Building Storybook app...")
            result = subprocess.run(['npm', 'run', 'build:storybook'], 
                          cwd=react_app_path, check=True, capture_output=True, text=True)
            print("✓ Storybook app built successfully")
            return True
        except subprocess.CalledProcessError as e:
            print(f"✗ Failed to build Storybook app: {e.stderr if e.stderr else str(e)}")
            print("Make sure your Storybook app has a 'build' script in package.json")
            return False

    def create_s3_bucket(self):
        """Create S3 bucket if it doesn't exist"""
        try:
            print("Check if bucket exists ")
            self.s3_client.head_bucket(Bucket=self.bucket_name)
            print(f"✓ S3 bucket '{self.bucket_name}' already exists")
            return True
        except ClientError as e:
            error_code = e.response['Error']['Code']
            if error_code == '404':
                # Bucket doesn't exist, create it
                try:
                    print(f"Creating S3 bucket: {self.bucket_name}")
                    if self.region == 'us-east-1':
                        self.s3_client.create_bucket(Bucket=self.bucket_name)
                    else:
                        self.s3_client.create_bucket(
                            Bucket=self.bucket_name,
                            CreateBucketConfiguration={'LocationConstraint': self.region}
                        )
                    
                    # Wait for bucket to be created
                    waiter = self.s3_client.get_waiter('bucket_exists')
                    waiter.wait(Bucket=self.bucket_name)
                    
                    print(f"✓ S3 bucket '{self.bucket_name}' created successfully")
                    return True
                except ClientError as e:
                    print(f"✗ Failed to create S3 bucket: {e}")
                    print("This could be due to:")
                    print("1. Insufficient permissions (s3:CreateBucket)")
                    print("2. Bucket name already taken (must be globally unique)")
                    print("3. Invalid bucket name")
                    return False
            elif error_code == '403':
                print(f"✗ Access denied to bucket '{self.bucket_name}'")
                print("This could mean:")
                print("1. The bucket exists but you don't have permission to access it")
                print("2. The bucket exists in another AWS account")
                print("3. Your credentials don't have s3:ListBucket permission")
                return False
            else:
                print(f"✗ Error checking S3 bucket: {e}")
                return False

    def configure_s3_bucket_for_hosting(self):
        """Configure S3 bucket for static website hosting"""
        try:
            # Enable static website hosting
            self.s3_client.put_bucket_website(
                Bucket=self.bucket_name,
                WebsiteConfiguration={
                    'ErrorDocument': {'Key': 'index.html'},
                    'IndexDocument': {'Suffix': 'index.html'}
                }
            )
            print("✓ Configured S3 bucket for static website hosting")

            # Set bucket policy to allow public read access
            bucket_policy = {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Sid": "PublicReadGetObject",
                        "Effect": "Allow",
                        "Principal": "*",
                        "Action": "s3:GetObject",
                        "Resource": f"arn:aws:s3:::{self.bucket_name}/*"
                    }
                ]
            }

            self.s3_client.put_bucket_policy(
                Bucket=self.bucket_name,
                Policy=json.dumps(bucket_policy)
            )
            print("✓ Set public read access policy")

            return True
        except ClientError as e:
            print(f"✗ Failed to configure S3 bucket: {e}")
            print("Required permissions: s3:PutBucketWebsite, s3:PutBucketPolicy")
            return False

    def upload_files_to_s3(self, build_dir):
        """Upload built files to S3 bucket with proper content types"""
        try:
            print("Uploading files to S3...")
            
            # Enhanced MIME type mapping
            mime_types = {
                '.html': 'text/html; charset=utf-8',
                '.htm': 'text/html; charset=utf-8',
                '.css': 'text/css; charset=utf-8',
                '.js': 'application/javascript; charset=utf-8',
                '.mjs': 'application/javascript; charset=utf-8',
                '.json': 'application/json; charset=utf-8',
                '.xml': 'application/xml; charset=utf-8',
                '.txt': 'text/plain; charset=utf-8',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.gif': 'image/gif',
                '.svg': 'image/svg+xml',
                '.webp': 'image/webp',
                '.ico': 'image/x-icon',
                '.woff': 'font/woff',
                '.woff2': 'font/woff2',
                '.ttf': 'font/ttf',
                '.eot': 'application/vnd.ms-fontobject',
                '.otf': 'font/otf',
                '.pdf': 'application/pdf',
                '.zip': 'application/zip',
                '.gz': 'application/gzip',
                '.map': 'application/json'  # Source maps
            }
            
            uploaded_count = 0
            for root, dirs, files in os.walk(build_dir):
                for file in files:
                    local_path = os.path.join(root, file)
                    relative_path = os.path.relpath(local_path, build_dir)
                    s3_key = relative_path.replace("\\", "/")
                    
                    # Get file extension
                    _, ext = os.path.splitext(file)
                    ext = ext.lower()
                    
                    # Determine content type
                    content_type = mime_types.get(ext, 'application/octet-stream')  # ✅ CORRECT
                    
                    extra_args = {
                        'ContentType': content_type,
                        'CacheControl': 'public, max-age=31536000'  # 1 year cache for static assets
                    }
                    
                    # Special handling for HTML files - shorter cache
                    if ext in ['.html', '.htm']:
                        extra_args['CacheControl'] = 'public, max-age=0, must-revalidate'
                    
                    print(f"Uploading: {s3_key} (Content-Type: {content_type})")
                    
                    self.s3_client.upload_file(
                        local_path, 
                        self.bucket_name, 
                        s3_key,
                        ExtraArgs=extra_args
                    )
                    uploaded_count += 1
            
            print(f"✓ {uploaded_count} files uploaded successfully")
            return True
        except (ClientError, NoCredentialsError) as e:
            print(f"✗ Failed to upload files to S3: {e}")
            return False

    def get_website_url(self):
        """Get the website URL"""
        if self.region == 'us-east-1':
            return f"http://{self.bucket_name}.s3-website-us-east-1.amazonaws.com"
        else:
            return f"http://{self.bucket_name}.s3-website.{self.region}.amazonaws.com"

    def deploy(self, react_app_path):
        """
        Main deployment method
        
        Args:
            react_app_path (str): Path to React app directory
        """
        print("Starting React app deployment to S3...")
        print(f"Bucket: {self.bucket_name}")
        print(f"Region: {self.region}")
        print(f"React app path: {react_app_path}")
        print("-" * 50)
        
        # Check AWS permissions first
        if not self.check_aws_permissions():
            return False
        
        # Check prerequisites
        if not self.check_prerequisites():
            return False
        
        # Verify React app directory exists
        react_app_path = os.path.abspath(react_app_path)
        if not os.path.exists(react_app_path):
            print(f"✗ React app directory not found: {react_app_path}")
            return False
        
        build_dir = os.path.join(react_app_path, 'storybook-static')
        
        try:            
            # # Build React app
            if not self.build_storybook_app(react_app_path):
                return False
            
            # Verify build directory exists
            if not os.path.exists(build_dir):
                print("✗ Build directory not found. React app build may have failed.")
                return False
            
            # Create S3 bucket
            if not self.create_s3_bucket():
                return False
            
            # Configure S3 for hosting
            if not self.configure_s3_bucket_for_hosting():
                return False
            
            # Upload files to S3
            if not self.upload_files_to_s3(build_dir):
                return False

            # Invalidate CloudFront (non-fatal)
            try:
                inval_ok = self.invalidate_cloudfront()
                if not inval_ok:
                    print("⚠️ CloudFront invalidation reported failure (continuing).")
            except Exception as e:
                print(f"⚠️ Unexpected error during CloudFront invalidation: {e}")
            
            # Get website URL
            website_url = self.get_website_url()
            
            print(f"\n🎉 Deployment completed successfully!")
            print(f"Your React app is now live at: {website_url}")
            print("\nNext steps:")
            print(f"1. Visit {website_url} to see your app")
            print("2. Consider setting up CloudFront for HTTPS and better performance")
            print("3. Set up a custom domain with Route 53 if needed")
            return True
            
        except Exception as e:
            print(f"\n❌ Deployment failed: {e}")
            import traceback
            traceback.print_exc()
            return False

def main():
    parser = argparse.ArgumentParser(description='Build React app and deploy to AWS S3')
    parser.add_argument('--bucket', '-b', required=True, help='S3 bucket name (must be globally unique)')
    parser.add_argument('--path', '-p', default='.', help='Path to React app directory (default: current directory)')
    parser.add_argument('--region', default='us-east-1', help='AWS region (default: us-east-1)')
    parser.add_argument('--profile', help='AWS profile name')
    parser.add_argument('--distribution-id', '-d', help='CloudFront Distribution ID to invalidate after deploy')
    parser.add_argument('--list-regions', action='store_true', help='List available AWS regions')
    
    args = parser.parse_args()
    
    if args.list_regions:
        print("Available AWS regions:")
        regions = [
            'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
            'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-central-1',
            'ap-south-1', 'ap-northeast-1', 'ap-northeast-2', 'ap-southeast-1', 'ap-southeast-2',
            'sa-east-1', 'ca-central-1'
        ]
        for region in regions:
            print(f"  {region}")
        return
    
    # Create deployer instance (pass optional CloudFront distribution id)
    deployer = ReactS3Deployer(
        bucket_name=args.bucket,
        region=args.region,
        profile=args.profile,
        distribution_id=args.distribution_id
    )
    
    # Execute deployment
    success = deployer.deploy(args.path)
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()