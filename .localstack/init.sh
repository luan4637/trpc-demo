#!/bin/bash
cd /usr/share/code
awslocal s3api create-bucket --bucket sample-bucket
awslocal s3api put-bucket-cors --bucket sample-bucket --cors-configuration file://.localstack/aws-cors-config.json
