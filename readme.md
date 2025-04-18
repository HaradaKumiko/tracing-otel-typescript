# remove all running
docker rm -f $(docker ps -aq)

# build and run
docker compose up --build -d


# remove all container and volume
docker compose down -v --remove-orphans


# insert data 
bash ../scripts/insert_data.sh