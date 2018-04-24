# web-video-security-system
Video security system working in a local network, it uses all the cameras connected to a node and then sends the feeds to the main django server

Project Requirements:
  - Docker

Docker Requirements:
  - Windows 10 Professional
  - Any Linux distro that runs Docker (most of them)

You need to make a docker-compose file with your cams volumes path to the project added, using the current docker-compose.yml file 
as guide change the cams container volumes to ~/[your]/[path]/[to]/[project-root]


If you have sudo permissions you may just run and forget about the installation process (it will also start the containers when it's
done:

  [project-root]$ sh deploy.sh /[your-path]/[to-your-custom-docker-compose-file]

Docker and Docker Compose commands may need sudo

Installation:

  [project-root]$ docker build -t cams:app .

  [project-root]/docker/db$ docker build -t cams:db .

With the docker-compose file and docker images created you just need to go into your docker folder and run

  [project-root]/docker$ docker-compose -f [your-docker-compose-file] up # To start the containers

  [project-root]/docker$ docker-compose -f [your-docker-compose-file] down # To stop the containers
  
 While the containers are running you also need to create your postgresql database:

  $ docker exec -it docker_db_cams_1 bash

  root-of-db-container$ createdb -U cams cams_db

  ctrl-c
  

  Now just restart your containers with the docker-compose commands and you're good to go!
