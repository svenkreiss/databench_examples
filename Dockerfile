FROM ubuntu
MAINTAINER Sven Kreiss email: me@svenkreiss.com

# update the system and install prerequisites
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y git python-pip python-matplotlib python-all-dev

# add this directory to the working directory of the docker image
ADD . .

# install all Python requirements
RUN pip install -r requirements.txt

# configure the server
EXPOSE 5000
ENTRYPOINT ["databench", "--log=DEBUG", "--host=0.0.0.0", "--port=5000"]
