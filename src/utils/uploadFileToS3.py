import json
import boto3
import base64
from botocore.exceptions import ClientError
from datetime import datetime

# Initialize the S3 client
s3 = boto3.client('s3')

def lambda_handler(event, context):
    # Check if there is a 'file' key in the event
    if 'file' not in event:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps('No file found in the JSON payload.')
        }

    # Get the base64 encoded file content
    base64_file_content = event['file']

    # Assuming the format is "data:<content_type>;base64,<data>"
    # We need to split off the base64 data from the content type prefix
    _, base64_data = base64_file_content.split(',', 1)

    # Decode the base64 string into bytes
    file_content = base64.b64decode(base64_data)

    # Generate a unique filename using the current timestamp
    current_time = datetime.now().strftime("%Y%m%d%H%M%S")
    originFileName = event['fileName']
    filename = f"originFileName{current_time}.pdf"
    # Example: "myfile_20220407153000.pdf"


    # Define the S3 bucket and the key (filename) where the file will be stored
    bucket_name = 'receipts-documents-bucket'
    #file_key = 'uploads/myfile.pdf' # You should generate a unique filename or key here
    file_key = f'uploads/{filename}'
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
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(f'Error writing file to S3: {str(e)}')
        }