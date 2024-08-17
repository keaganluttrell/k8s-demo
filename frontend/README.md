# frontend

## Quickstart to test app
```bash
$ npm install
$ npm start
```
play around with the frontend

kube-demo readme guide for this app
follow this readme and make sure to substitute `frontend` where needed.

## Deploy notes
In [frontend-deploy.yml](./frontend-deploy.yml) the gateway and mapping are commented out. If you are following the standard configuration in [infrastructure](https://gitlab.com/kube-demo/infrastructure#configure-1) repo, you will not need to route `frontend` to `gateway`