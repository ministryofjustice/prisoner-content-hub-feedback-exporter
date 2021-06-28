{{/* vim: set filetype=mustache: */}}
{{/*
Environment variables for web and worker containers
*/}}
{{- define "deployment.envs" }}
env:
    - name: SPREADSHEET_ID
      valueFrom:
        secretKeyRef:
            name: {{ include "app.name" . }}
            key: SPREADSHEET_ID

    - name: SERVICE_ACCOUNT_KEY
      valueFrom:
        secretKeyRef:
            name: {{ include "app.name" . }}
            key: SERVICE_ACCOUNT_KEY

    - name: ELASTICSEARCH_ENDPOINT
      valueFrom:
        secretKeyRef:
            name: {{ include "app.name" . }}
            key: ELASTICSEARCH_ENDPOINT
{{- end -}}