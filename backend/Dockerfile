FROM python:3.8

WORKDIR /root

COPY . /root

RUN pip3 install flask flask-cors psycopg2 reportlab
RUN mkdir images && \
    rm /etc/localtime && \    
    ln -s /usr/share/zoneinfo/America/Mexico_City /etc/localtime

EXPOSE 2420

ENTRYPOINT python3 server.py
