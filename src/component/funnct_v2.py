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

    # Créer un message d'erreur incluant le contenu de l'événement
    error_message = f'No file found in the JSON payload. {json.dumps(event)}'
    error_message2 = f'No body found in the JSON payload. {json.dumps(event)}'

    try:
        if 'file' in event:
            return {
                'statusCode': 400,
                'headers':{
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(event)
            }
            #body = json.loads(event['file'])
            if True :
                #file_content_base64 = body['file']
                # Decode the base64 string
                #file_content = base64.b64decode(file_content_base64)

                # Define the S3 bucket and the key (filename) where the file will be stored
                bucket_name = 'receipts-documents-bucket'
                file_key = 'uploads/myfile.pdf' # Example: 'uploads/myfile.pdf'

                # Upload the file to S3
                #try:
                #    s3.put_object(Bucket=bucket_name, Key=file_key, Body=file_content)
            else:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps(error_message)
                }
        else:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(error_message2)
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