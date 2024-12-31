const { DynamoDB } = require('@aws-sdk/client-dynamodb');

const dynamodb = new DynamoDB({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    credentials: {
        accessKeyId: 'dummy',
        secretAccessKey: 'dummy'
    }
});

const params = {
    TableName: 'customers-table-dev',
    AttributeDefinitions: [
        { AttributeName: 'userId', AttributeType: 'S' },
        { AttributeName: 'availableCredit', AttributeType: 'N' }
    ],
    KeySchema: [
        { AttributeName: 'userId', KeyType: 'HASH' }
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: 'CreditIndex',
            KeySchema: [
                { AttributeName: 'availableCredit', KeyType: 'HASH' }
              ],
            Projection: {
                ProjectionType: 'ALL'
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};

const createTable = async () => {
    try {
        await dynamodb.deleteTable({ TableName: params.TableName }).catch(() => {});
        console.log('Table deleted if existed');
        
        const result = await dynamodb.createTable(params);
        console.log('Table created successfully:', result);
    } catch (error) {
        console.error('Error creating table:', error);
    }
};

createTable();
