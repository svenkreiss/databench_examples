.. image:: http://databench.trivial.io/en/latest/_static/logo-w600.png
    :target: http://databench.trivial.io

Databench Examples
==================

    Example analyses for `Databench <https://github.com/svenkreiss/databench/>`_. Live demos of some of them are at `databench-examples.trivial.io <http://databench-examples.trivial.io>`_ and the `Databench documentation is here <http://databench.trivial.io>`_.

.. image:: https://travis-ci.org/svenkreiss/databench_examples.png?branch=master
    :target: https://travis-ci.org/svenkreiss/databench_examples


Environment and Install
-----------------------

Setup your environment and install dependencies in the current directory with::

    git clone https://github.com/svenkreiss/databench_examples.git .

    virtualenv venv
    source venv/bin/activate
    pip install -r requirements.txt


Example Outputs
---------------

.. image:: doc/images/mpld3pi_demo.png
    :target: http://databench-examples.trivial.io/mpld3pi/
.. image:: doc/images/mpld3_PointLabel.png
    :target: http://databench-examples.trivial.io/mpld3PointLabel/
.. image:: doc/images/mpld3_heart_path.png
    :target: http://databench-examples.trivial.io/mpld3Drag/


Docker
------

    docker build -t svenkreiss/databench_examples
    docker run --name databench_examples -d -p 5000:5000 svenkreiss/databench_examples


Kubernetes
----------

    gcloud container clusters create cluster-1 --num-nodes 1 --machine-type g1-small
    gcloud compute instances list  # for info
    kubectl run databench-examples --image=svenkreiss/databench_examples --port=5000
    kubectl expose rc databench-examples --type=LoadBalancer --port=80 --target-port=5000
    kubectl describe services databench-examples  # for info
    kubectl get services databench-examples  # for info, get public ip
