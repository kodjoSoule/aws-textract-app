import json
import boto3

def lambda_handler(event, context):
    print(event)

    # Créer un client pour l'API Textract
    textract = boto3.client('textract')

    # Créer un client pour DynamoDB
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('db_receipts')  # Assurez-vous que le nom de votre table est correct

    try:
        # Récupérer les informations du bucket et de l'objet depuis l'événement S3
        bucket_name = event['Records'][0]['s3']['bucket']['name']
        document_key = event['Records'][0]['s3']['object']['key']
        print(f'Nom du fichier : {document_key}')

        # Appeler Textract pour analyser le document PDF
        textract_response = textract.analyze_document(
            Document={
                'S3Object': {
                    'Bucket': bucket_name,
                    'Name': document_key
                }
            },
            FeatureTypes=["FORMS"]  # Utiliser "FORMS" pour les formulaires
        )

        # Extraire les paires clé-valeur
        key_map = {}
        value_map = {}
        block_map = {}

        for block in textract_response['Blocks']:
            block_id = block['Id']
            block_map[block_id] = block
            if block['BlockType'] == 'KEY_VALUE_SET':
                if 'KEY' in block['EntityTypes']:
                    key_map[block_id] = block
                else:
                    value_map[block_id] = block

        # Associer les clés à leurs valeurs correspondantes
        key_value_pairs = {}
        for block_id, key_block in key_map.items():
            value_block = find_value_block(key_block, value_map)
            key = get_text(key_block, block_map)
            val = get_text(value_block, block_map)
            key_value_pairs[key] = val

        # Enregistrer les paires clé-valeur dans DynamoDB
        item = {
            'receipts_Id': document_key,
            'DocumentKey': document_key,
            'KeyValuePairs': key_value_pairs
            # Ajoutez d'autres métadonnées ici si nécessaire
        }

        table.put_item(Item=item)

        print('Paires clé-valeur extraites enregistrées dans DynamoDB avec succès.')

        return {
            'statusCode': 200,
            'body': json.dumps('Paires clé-valeur extraites enregistrées avec succès.')
        }
    except Exception as e:
        print(f'Erreur : {str(e)}')
        return {
            'statusCode': 500,
            'body': json.dumps("Erreur lors du traitement du document")
        }

# Fonction pour trouver le bloc de valeur correspondant à un bloc de clé
def find_value_block(key_block, value_map):
    for relationship in key_block.get('Relationships', []):
        if relationship['Type'] == 'VALUE':
            for value_id in relationship['Ids']:
                if value_id in value_map:
                    return value_map[value_id]
    return None

# Fonction pour obtenir le texte d'un bloc
def get_text(result, block_map):
    text = ''
    if 'Relationships' in result:
        for relationship in result['Relationships']:
            if relationship['Type'] == 'CHILD':
                for child_id in relationship['Ids']:
                    child = block_map[child_id]
                    if child['BlockType'] == 'WORD':
                        text += child['Text'] + ' '
                    if child['BlockType'] == 'SELECTION_ELEMENT':
                        if child['SelectionStatus'] == 'SELECTED':
                            text += 'X '
    return text.strip()