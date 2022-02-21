# prisoner-content-hub-feedback-exporter
Extracts feedback from elasticsearch and pushes into google sheets for access in google data studio

### Run linter

`npm run lint`

### Run tests

`npm run test`

### Dependency Checks

The template project has implemented some scheduled checks to ensure that key dependencies are kept up to date.
If these are not desired in the cloned project, remove references to `check_outdated` job from `.circleci/config.yml`

## Running the app

Connect to elastic search via port-forward: 

`kubectl port-forward <proxy-pod-name> 9200:9200`



`npm run build && npm start`

### Runing the app for development

To compile and run the job run: 

