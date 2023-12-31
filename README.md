Porovnu Backend

Generate certificates

Facebook OAuth requires that your server runs on https in development as well, so you need to generate certificates. Go to /security folder and run this.

```
$ cd ./security
$ openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout cert.key -out cert.pem -config req.cnf -sha256
```
To run server in development:

```bash
docker compose -f docker-compose.dev.yml up -d 
```

To run server in production:
```bash
docker compose up -d 
```

APP WILL BE SERVED FROM:

```bash
https://localhost:80
```

SWAGGER:
```bash
https://localhost:80/docs
```
