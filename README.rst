.. image:: https://raw.githubusercontent.com/svenkreiss/databench/master/logo/logo-w100.png
    :target: http://databench.trivial.io

Databench Examples
==================

    Example analyses for `Databench <https://github.com/svenkreiss/databench/>`_. Live demos of some of them are at `databench-examples.trivial.io <http://databench-examples.trivial.io>`_ and the `Databench documentation is here <http://databench.trivial.io>`_.

.. image:: https://travis-ci.org/svenkreiss/databench_examples.svg?branch=master
    :target: https://travis-ci.org/svenkreiss/databench_examples


Environment and Install
-----------------------

Setup your environment and install dependencies in the current directory with::

    git clone https://github.com/svenkreiss/databench_examples.git .

    virtualenv venv
    source venv/bin/activate
    pip install -r requirements.txt


Docker
------

.. code-block:: bash

    docker build -t svenkreiss/databench_examples .
    docker run --name databench_examples -d -p 5000:5000 svenkreiss/databench_examples


Kubernetes
----------

.. code-block:: bash

    # create cluster
    gcloud container clusters create cluster-1 --num-nodes 1 --machine-type g1-small
    gcloud compute instances list  # for info

    # set up container
    kubectl create -f rc.json
    kubectl create -f service.json

    # for info
    kubectl describe rc
    kubectl describe pods
    kubectl describe services

    # forward port
    kubectl port-forward databench-demo 5000
    # ... and open http://localhost:5000

    # update
    docker build -t svenkreiss/databench_examples .
    docker tag svenkreiss/databench_examples svenkreiss/databench_examples:c-$(git rev-parse HEAD)
    docker push svenkreiss/databench_examples:c-$(git rev-parse HEAD)
    kubectl rolling-update rc-databench-demo --image=svenkreiss/databench_examples:c-$(git rev-parse HEAD)
