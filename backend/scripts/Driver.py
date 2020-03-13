import Scheduler as sc
import boto3

dynamodb = boto3.resource('dynamodb')

def create_gainers_losers_table(table_name):
    try:
        dynamodb.create_table (
            TableName = table_name,
            KeyShcema = [
                {
                    'AttributeName': 'symbol',
                    'KeyType': 'HASH'
                }
            ],
            AttributeDefinitions = [
                {
                    'AttributeName': 'rank',
                    'KeyType': 'N'
                },
                {
                    'AttributeName': 'symbol',
                    'KeyType': 'S'
                },
                {
                    'AttributeName': 'market_cap',
                    'KeyType': 'N'
                },
                {
                    'AttributeName': 'price',
                    'KeyType': 'N'
                },
                {
                    'AttributeName': 'volume',
                    'KeyType': 'N'
                }
            ],
            ProvisionedThroughput = {
                'ReadCapacityUnits': 10,
                'WriteCapacityUnits': 10
            }
        )
    except dynamodb.exceptions.ResourceInUseException:
        pass

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