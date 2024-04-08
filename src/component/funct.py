# import json

# def lambda_handler(event, context):
#     # TODO implement
#     return {
#         'statusCode': 200,
#         'body': json.dumps('Hello from Lambda!')
#     }




import json
import boto3
import base64
from botocore.exceptions import ClientError

# Initialize the S3 client
s3 = boto3.client('s3')

def lambda_handler(event, context):
    # Parse the JSON payload from the event
    try:
        if 'body' in event:
            body = json.loads(event['body'])
            if 'file' in body:
                file_content_base64 = body['file']
                # Decode the base64 string
                file_content = base64.b64decode(file_content_base64)

                # Define the S3 bucket and the key (filename) where the file will be stored
                bucket_name = 'your-bucket-name'
                file_key = 'your-desired-key' # Example: 'uploads/myfile.pdf'

                # Upload the file to S3
                try:
                    s3.put_object(Bucket=bucket_name, Key=file_key, Body=file_content)
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps('File uploaded successfully to S3.')
                    }
                except ClientError as e:
                    print(e)
                    return {
                        'statusCode': 500,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps('Error writing file to S3.')
                    }
            else:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps('No file found in the JSON payload.')
                }
        else:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps('No body found in the event.')
            }
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps('Invalid JSON format.')
        }