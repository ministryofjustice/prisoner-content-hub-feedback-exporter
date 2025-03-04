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

Then run:
`npm run build && npm start`

### Running the app for development

To compile and run the job run:

### Running migrations

Migrations and database connections are done using [knexjs](https://knexjs.org/). All migrations are stored in `./database/migrations, ensure you use the correct knex file structure and methods to create the relevant migration script. Also ensure the files are named chronologically.

First grab the RDS secrets from the relevant namespace and add to your `.env` file for later use:

`kubectl get secrets prisoner-feedback-rds -o json | jq '.data | map_values(@base64d)'`

Create a port-forward pod and connect to it:

```
kubectl -n <namespace> run feedback-port-forward-pod  --image=ministryofjustice/port-forward --port=5432 --env="REMOTE_HOST=<rds_instance_address>" --env="LOCAL_PORT=5432"  --env="REMOTE_PORT=5432"
kubectl -n <namespace> port-forward feedback-port-forward-pod 5432:5432
```

Ensure you have a `.env` file with the relevant fields populated from the secret:

```
DATABASE_USERNAME=<from secret>
DATABASE_PASSWORD=<from secret>
DATABASE_URL=localhost
DATABASE_NAME=<from secret>
```

Next download the PEM file for SSL certification from https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem and place in the root of the app folder.

You can then run the migrations script:

`npm run migrations`

This will pick up the latest migrations from `./database/migrations`
