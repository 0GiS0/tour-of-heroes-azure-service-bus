# Variables
RESOURCE_GROUP="service-bus-demos"
LOCATION="westeurope"
QUEUE_NAME="heroes-queue"
TOPIC_NAME="heroes-topic"

# Create resource group
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create Service Bus namespace
az servicebus namespace create \
--resource-group $RESOURCE_GROUP \
--name $RESOURCE_GROUP \
--location $LOCATION

# Cteate Service Bus queue
az servicebus queue create \
--resource-group $RESOURCE_GROUP \
--namespace-name $RESOURCE_GROUP \
--name $QUEUE_NAME

# Get connection string
CONNECTION_STRING=$(az servicebus namespace \
authorization-rule keys list \
--resource-group $RESOURCE_GROUP \
--namespace-name $RESOURCE_GROUP \
--name RootManageSharedAccessKey \
--query primaryConnectionString \
--output tsv)

# Set variables in .env file
echo "CONN_STRING=$CONNECTION_STRING" > .env
echo "QUEUE_NAME=$QUEUE_NAME" >> .env
echo "TOPIC_NAME=$TOPIC_NAME" >> .env


# Send a single message
node 01.queue-demo.js

# Send a batch of messages
node 02.queue-batch-demo.js

# Get number of messages
az servicebus queue show \
--resource-group $RESOURCE_GROUP \
--namespace-name $RESOURCE_GROUP \
--name $QUEUE_NAME \
--query messageCount \
--output tsv

# Receive messages from a queue
node 03.receive-messages-from-a-queue.js

# Create a topic
az servicebus topic create \
--resource-group $RESOURCE_GROUP \
--namespace-name $RESOURCE_GROUP \
--name $TOPIC_NAME

# Create a subscription 
SUBSCRIPTION_NAME="simple-subscription"

az servicebus topic subscription create \
--resource-group $RESOURCE_GROUP \
--namespace-name $RESOURCE_GROUP \
--topic-name $TOPIC_NAME \
--name $SUBSCRIPTION_NAME

# Create a subscription with a filter
SUBSCRIPTION_NAME="gotham-subscription"

az servicebus topic subscription create \
--resource-group $RESOURCE_GROUP \
--namespace-name $RESOURCE_GROUP \
--topic-name $TOPIC_NAME \
--name $SUBSCRIPTION_NAME

# Create a filter on the gotham subscription
az servicebus topic subscription rule create \
--resource-group $RESOURCE_GROUP \
--namespace-name $RESOURCE_GROUP \
--topic-name $TOPIC_NAME \
--subscription-name $SUBSCRIPTION_NAME \
--name "gotham-filter" \
--filter-sql-expression "city = 'gotham'"

SUBSCRIPTION_NAME="smallville-subscription"

az servicebus topic subscription create \
--resource-group $RESOURCE_GROUP \
--namespace-name $RESOURCE_GROUP \
--topic-name $TOPIC_NAME \
--name $SUBSCRIPTION_NAME

# Filter with an action
az servicebus topic subscription rule create \
--resource-group $RESOURCE_GROUP \
--namespace-name $RESOURCE_GROUP \
--topic-name $TOPIC_NAME \
--subscription-name $SUBSCRIPTION_NAME \
--name "smallville-filter-action" \
--filter-sql-expression "city = 'smallville'" \
--action-sql-expression "set city = 'Smallville, Kansas'"


# Send messages to a topic
node 04-send-messages-to-a-topic.js

# More examples here: https://learn.microsoft.com/en-us/samples/azure/azure-sdk-for-js/service-bus-javascript/