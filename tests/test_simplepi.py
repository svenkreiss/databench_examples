import os
import requests
import signal
import subprocess
import time


DAEMON = None
LOGLEVEL = 'DEBUG'


def setup_module():
    global DAEMON

    # call os.setsid so that all subprocesses terminate when the
    # main process receives SIGTERM
    DAEMON = subprocess.Popen(['databench',
                               '--log={}'.format(LOGLEVEL)],
                              close_fds=True,
                              stdin=subprocess.PIPE,
                              stdout=subprocess.PIPE,
                              preexec_fn=os.setsid)

    # on CI, matplotlib needs time to build a font cache
    if os.getenv('CI'):
        time.sleep(3)

    time.sleep(10)


def teardown_module():
    global DAEMON

    # simply DAEMON.terminate() would only terminate the main process,
    # but the nested processes also need to be terminated
    #
    # SIGUSR1 does not exist on Windows
    if hasattr(signal, 'SIGUSR1'):
        os.killpg(DAEMON.pid, signal.SIGUSR1)
    else:
        os.killpg(DAEMON.pid, signal.SIGTERM)
    DAEMON.wait()


def test_get():
    r = requests.get('http://127.0.0.1:5000/simplepi/')
    assert r.status_code == 200


if __name__ == '__main__':
    setup_module()
    test_get()
    teardown_module()
