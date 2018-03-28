#!/bin/bash

cd /root/cams/backend

pip3 install -r /tmp/pip3-requirements.txt

python3 manage.py makemigrations --noinput

python3 manage.py migrate --noinput

python3 manage.py collectstatic --noinput

env > /etc/environment

supervisord -n
