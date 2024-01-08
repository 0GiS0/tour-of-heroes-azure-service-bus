# Variables
RESOURCE_GROUP="service-bus-demos"
LOCATION="westeurope"
QUEUE_NAME="heroes-queue"

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

CONN_STRING=$CONNECTION_STRING QUEUE_NAME=$QUEUE_NAME node 01.queue-demo.js

CONN_STRING=$CONNECTION_STRING QUEUE_NAME=$QUEUE_NAME node 02.queue-batch-demo.js

# Get number of messages
az servicebus queue show \
--resource-group $RESOURCE_GROUP \
--namespace-name $RESOURCE_GROUP \
--name $QUEUE_NAME \
--query messageCount \
--output tsv

