#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

BASE_URL="http://localhost:3000"
LOOP_COUNT=1000  # change to 100 or 1000 if you want

# Sample product data
NAMES=("Laptop" "Smartphone" "Tablet" "Headphones" "Keyboard" "Mouse" "Monitor" "Camera" "Speaker" "Router")
DESCRIPTIONS=(
  "High quality product with advanced features"
  "Latest model with improved performance"
  "Premium build quality and durability"
  "Energy efficient and eco-friendly"
  "User-friendly interface and design"
)

generate_name() {
  echo "${NAMES[$RANDOM % ${#NAMES[@]}]} $1"
}

generate_price() {
  echo $((RANDOM % 9900 + 100))
}

generate_description() {
  echo "${DESCRIPTIONS[$RANDOM % ${#DESCRIPTIONS[@]}]}"
}

make_request() {
  local method=$1
  local endpoint=$2
  local data=$3

  if [ -n "$data" ]; then
    curl -s -X "$method" "${BASE_URL}${endpoint}" \
      -H "Content-Type: application/json" \
      -d "$data"
  else
    curl -s -X "$method" "${BASE_URL}${endpoint}" \
      -H "Content-Type: application/json"
  fi
}

# Main loop
for i in $(seq 1 $LOOP_COUNT); do
  echo -e "\n${BLUE}--- Product #$i ---${NC}"

  name=$(generate_name $i)
  price=$(generate_price)
  description=$(generate_description)

  create_payload=$(cat <<EOF
{
  "name": "$name",
  "price": $price,
  "description": "$description"
}
EOF
)

  # CREATE
  echo -e "${BLUE}[CREATE]${NC}"
  create_response=$(make_request "POST" "/products" "$create_payload")
  echo "$create_response" | jq .
  product_id=$(echo "$create_response" | jq -r '.id')

  if [[ -z "$product_id" || "$product_id" == "null" ]]; then
    echo -e "${RED}❌ Failed to create product $i${NC}"
    continue
  fi

  # READ
  echo -e "${BLUE}[READ]${NC}"
  make_request "GET" "/products/$product_id" | jq .

  # UPDATE
  new_price=$(generate_price)
  new_description="Updated: $(generate_description)"
  update_payload=$(cat <<EOF
{
  "price": $new_price,
  "description": "$new_description"
}
EOF
)

  echo -e "${BLUE}[UPDATE]${NC}"
  make_request "PUT" "/products/$product_id" "$update_payload" | jq .

  # READ AGAIN
  echo -e "${BLUE}[READ AFTER UPDATE]${NC}"
  make_request "GET" "/products/$product_id" | jq .

  # DELETE
  echo -e "${BLUE}[DELETE]${NC}"
  make_request "DELETE" "/products/$product_id" | jq .

  # VERIFY DELETE
  echo -e "${BLUE}[VERIFY DELETE]${NC}"
  make_request "GET" "/products/$product_id" | jq .

  echo -e "${GREEN}✅ Completed CRUD for product ID: $product_id${NC}"
done

echo -e "\n${GREEN}🎉 Finished full CRUD loop for $LOOP_COUNT products.${NC}"
