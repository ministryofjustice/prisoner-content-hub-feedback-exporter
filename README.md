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

ensure the following env vars are set in `.env`:
```
  SERVICE_ACCOUNT_KEY=some-value
  SPREADSHEET_ID=some-value
  GOV_NOTIFY_API_KEY=some-value
```

also to test the gov notify email functionality locally, ensure the following env var is set:
```
  NOTIFICATION_DAY=current-day-value
```

(Establishment must match the (uppercase) drupal id for the establishment)

Then run:
`npm run build && npm start`

### Runing the app for development

To compile and run the job run: 

