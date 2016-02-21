FROM ubuntu
MAINTAINER Sven Kreiss email: me@svenkreiss.com

# update the system and install prerequisites
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y git python-pip libpython-dev python-matplotlib libfreetype6-dev pkg-config

# add this directory to the working directory of the docker image
ADD . .

# install all Python requirements
RUN pip install --upgrade pip  &&  pip install -r requirements.txt

# configure the server
EXPOSE 5000
ENTRYPOINT ["databench", "--log=INFO", "--port=5000"]
