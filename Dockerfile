# This image can be built based on a standard ubuntu image. However,
# given the many dependencies, it is more efficient to base it on an image
# that has most dependencies already installed, like svenkreiss/flask_gevent.

#FROM ubuntu
FROM svenkreiss/flask_gevent
MAINTAINER Sven Kreiss email: me@svenkreiss.com

# update the system and install prerequisites
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y git python-pip libpython-dev python-matplotlib

# add this directory to the working directory of the docker image
ADD . .

# install all Python requirements
RUN pip install -r requirements.txt

# configure the server
EXPOSE 5000
ENTRYPOINT ["databench", "--log=DEBUG", "--host=0.0.0.0", "--port=5000"]
