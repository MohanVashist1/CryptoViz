import Scheduler as sc
import boto3

dynamodb = boto3.client('dynamodb')

def create_gainers_losers_table(table_name):
    try:
        table = dynamodb.create_table (
            TableName = table_name,
            KeySchema = [
                {
                    'AttributeName': 'symbol',
                    'KeyType': 'HASH'
                },
                {
                    'AttributeName': 'rank',
                    'KeyType': 'RANGE'
                }
            ],
            AttributeDefinitions = [
                {
                    'AttributeName': 'rank',
                    'AttributeType': 'N'
                },
                {
                    'AttributeName': 'symbol',
                    'AttributeType': 'S'
                }
            ],
            ProvisionedThroughput = {
                'ReadCapacityUnits': 10,
                'WriteCapacityUnits': 10
            }
        )
        table.meta.client.get_waiter('client_exists').wait(TableName=table_name)
    except dynamodb.exceptions.ResourceInUseException:
        return

if __name__ == "__main__":
    create_gainers_losers_table('top_gainers_hourly')
    create_gainers_losers_table('top_losers_hourly')
    create_gainers_losers_table('top_gainers_daily')
    create_gainers_losers_table('top_losers_daily')
    # try:
    #     dynamodb.create_table (
    #         TableName = 'users',
    #         KeyShcema = [
    #             {
    #                 'AttributeName': 'username',
    #                 'KeyType': 'HASH'
    #             }
    #         ],
    #         AttributeDefinitions = [
    #             {
    #                 'AttributeName': 'username',
    #                 'KeyType': 'S'
    #             },
    #             {
    #                 'AttributeName': 'password',
    #                 'KeyType': 'S'
    #             }
    #         ],
    #         ProvisionedThroughput = {
    #             'ReadCapacityUnits': 10,
    #             'WriteCapacityUnits': 10
    #         }
    #     )
    # except dynamodb.exceptions.ResourceInUseException:
    #     pass
    sc.schedule_tasks()
