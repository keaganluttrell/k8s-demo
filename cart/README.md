# Basic Backend Api Setup
Readme for kube-demo backend api's

## Assumptions

- Following the the [Infrastructure README](https://gitlab.com/kube-demo/infrastructure)
- You are using Gitlab
- You have forked this to your Gitlab Group Repo (eg. kube-demo)
- You have node version 14 or greater
- You have kubectl cli installed
---

## Quickstart to test app
```bash
$ npm install
$ npm start
```
---
## Local Deploy

_**be sure your kubectl context is set to your EKS cluster_ 
([setup docs](https://gitlab.com/kube-demo/cart))

```bash
$ kubectl apply -f cart-deploy.yml # or whatever repo you are in (eg. products-deploy.yml...)
```
_note: if this deploy fails, it assumes that you have spring cloud gateway configured properly. If you are not using the gateway, you can comment out or remove the `SpringCloudGatewayRouteConfig` and `SpringCloudGatewayMapping` configurations in the [cart-deploy.yml](./cart-deploy.yml)_

Verify success
```bash
$ kubectl get all -l app=cart-api
NAME                            READY   STATUS    RESTARTS   AGE
pod/cart-api-5df8c4b46d-9hnf2   1/1     Running   0          19m

NAME                                  DESIRED   CURRENT   READY   AGE
replicaset.apps/cart-api-5df8c4b46d   1         1         1       19m
```

Teardown if no longer needed
```bash
$ kubectl -f cart-deploy.yml 
```


## Pipeline Deploy

Any **merge** or **push** to `main` will kick off the pipeline.

Make sure you reference your base image in [.gitlab-ci.yml](/.gitlab-ci.yml). See [link](https://gitlab.com/kube-demo/infrastructure#infrastructe-image)

```yml
#.gitlab-ci.yml
stages:     
  - build
  - docker
  - deploy

build:
  stage: build
  image: node:16
  script:
    - npm install
  cache:
    paths:
        - node_modules/

docker:
  image: docker:20
  needs:
    - build
  stage: docker
  services:
    - docker:dind
  before_script:
    - echo "$MY_NAME"
    - echo $CI_BUILD_TOKEN | docker login -u "$CI_REGISTRY_USER" --password-stdin $CI_REGISTRY
  script:
    - docker build --pull -t "$CI_REGISTRY_IMAGE":"$CI_PIPELINE_IID" .
    - docker push "$CI_REGISTRY_IMAGE":"$CI_PIPELINE_IID"
    - docker tag "$CI_REGISTRY_IMAGE":"$CI_PIPELINE_IID" "$CI_REGISTRY_IMAGE":"latest"
    - docker push "$CI_REGISTRY_IMAGE":"latest"

deploy:
  stage: deploy
  # be sure to link your image below
  image: registry.gitlab.com/kube-demo/infrastructure:latest
  needs:
    - build
    - docker
  before_script:
    - export IMAGE="$CI_REGISTRY_IMAGE":"$CI_PIPELINE_IID"
    - aws configure set region "$AWS_DEFAULT_REGION"
    - aws configure set output json
    - aws eks update-kubeconfig --name "$CLUSTER_NAME"
    - aws sts get-caller-identity
  script:
    - envsubst < cart-deploy.yml | kubectl apply -f -
  only:
    - main
```

---
## Documentation

### Motivation
- This is a simple express server designed to be used in a kubernetes cluster with microservice architecture

### Deploy yml breakdown

This file actually has 4 separate configurations
1. Deployment -- [deploy token config](https://gitlab.com/kube-demo/infrastructure#create-deploy-token-in-gitlab)
    ```yml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
    name: cart-api
    spec:
    replicas: 1
    selector:
        matchLabels:
        app: cart-api
    template:
        metadata:
        labels:
            app: cart-api
        spec:
        containers:
            # make sure to use your image registry location
            # image pulled from gitlab registry -- built in .gitlab-ci.yaml
            - image: registry.gitlab.com/kube-demo/cart:latest
            name: cart-api
            imagePullPolicy: Always
            ports:
                - containerPort: 8000
        imagePullSecrets:
            # gitlab deploy token -- see above link above
            - name: k8s-demo-deploy-token
    ```
2. Service
    ```yml
    apiVersion: v1
    kind: Service
    metadata:
    name: cart-api-lb
    spec:
    type: LoadBalancer
    selector:
        app: cart-api # links to deployment metadata label
    ports:
        - protocol: TCP
        port: 80
        targetPort: 8000
        name: http
    ```
3. Route Config
    ```yml
    apiVersion: "tanzu.vmware.com/v1"
    kind: SpringCloudGatewayRouteConfig
    metadata:
    name: cart-route-config
    spec:
    service:
        name: cart-api-lb # links to service metadata name
    routes:
        - predicates:
            - Path=/api/cart/**
        filters:
            - StripPrefix=1 # strips "api" from path
    ```
4. Mapping
    ```yml
    apiVersion: "tanzu.vmware.com/v1"
    kind: SpringCloudGatewayMapping
    metadata:
    name: cart-mapping
    spec:
    gatewayRef:
        name: cluster-gateway # ref to our gateway config in infrastructure repo
        namespace: default
    routeConfigRef:
        name: cart-route-config # links to route config name 
    ```