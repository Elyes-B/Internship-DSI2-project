after you build the container images with: 'docker compose build' you need to create the project files in your front end and backend files
here are the commands:

- Frontend:

docker compose run --rm frontend new frontend --directory . --routing=true --style=css --skip-git --force

add the following lines to the dockerfile and run 'docker compose build' again

# copies packages files
COPY package*.json ./

# installs dependencies
RUN npm install

- Backend:

docker compose run --rm --entrypoint "sh -c 'composer create-project codeigniter4/appstarter temp_app && cp -rn temp_app/. . && rm -rf temp_app'" backend

this solution  works since compose refuses to create a project inside a non empty folder so that is why we create it inside a tmp folder and then we move its content to our main folder

after successfully setting up the front end and backend write the following commands to start you containers and see their status/logs to verify that the project is fully working

docker compose up -d

docker compose ps

docker compose logs -f