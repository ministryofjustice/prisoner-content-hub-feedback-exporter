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
            name: pfs-opensearch-proxy-url
            key: proxy_url

    - name: GOV_NOTIFY_API_KEY
      valueFrom:
        secretKeyRef:
            name: {{ include "app.name" . }}
            key: GOV_NOTIFY_API_KEY
            optional: true

{{- end -}}