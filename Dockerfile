FROM ubuntu:15.10
MAINTAINER Sven Kreiss email: me@svenkreiss.com

# update the system and install prerequisites
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y git python-pip libpython-dev python-matplotlib libfreetype6-dev pkg-config && \
    apt-get clean
RUN pip install --upgrade pip

# install all Python requirements
ADD requirements.txt requirements.txt
RUN pip install -r requirements.txt
RUN pip install --upgrade git+https://github.com/svenkreiss/databench.git@d14cb11#egg=databench

# add this directory to the working directory of the docker image
ADD analyses analyses

# configure the server
EXPOSE 5000
ENTRYPOINT ["databench", "--log=INFO", "--port=5000", "--host=0.0.0.0"]
