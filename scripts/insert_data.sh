#!/bin/bash

# Base URL of your API
API_URL="http://localhost:3000/products"

# Array of sample product names
NAMES=("Laptop" "Smartphone" "Tablet" "Headphones" "Keyboard" "Mouse" "Monitor" "Camera" "Speaker" "Router")

# Function to generate random price between 100 and 10000
generate_random_price() {
    echo $((RANDOM % 9900 + 100))
}

# Function to generate random description
generate_random_description() {
    DESCRIPTIONS=(
        "High quality product with advanced features"
        "Latest model with improved performance"
        "Premium build quality and durability"
        "Energy efficient and eco-friendly"
        "User-friendly interface and design"
    )
    echo "${DESCRIPTIONS[$RANDOM % ${#DESCRIPTIONS[@]}]}"
}

# Loop 1000 times
for i in {1..1000}; do
    # Generate random data
    NAME="${NAMES[$RANDOM % ${#NAMES[@]}]} $i"
    PRICE=$(generate_random_price)
    DESCRIPTION=$(generate_random_description)

    # Create JSON payload
    PAYLOAD=$(cat <<EOF
{
    "name": "$NAME",
    "price": $PRICE,
    "description": "$DESCRIPTION"
}
EOF
    )

    # Send POST request
    echo "Inserting product $i: $NAME"
    curl -X POST "$API_URL" \
         -H "Content-Type: application/json" \
         -d "$PAYLOAD"

    # Add a small delay to prevent overwhelming the server
    sleep 0.1
done

echo "Finished inserting 1000 products" 