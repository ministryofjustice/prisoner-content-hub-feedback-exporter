{{/* vim: set filetype=mustache: */}}
{{/*
Environment variables for web and worker containers
*/}}
{{- define "deployment.envs" }}
env:
    - name: SPREADSHEET_ID
        valueFrom:
        secretKeyRef:
            name: {{ include "prisoner-content-hub-feedback-exporter.fullname" . }}
            key: SPREADSHEET_ID

    - name: SERVICE_ACCOUNT_KEY
        valueFrom:
        secretKeyRef:
            name: {{ include "prisoner-content-hub-feedback-exporter.fullname" . }}
            key: SERVICE_ACCOUNT_KEY

    - name: ELASTICSEARCH_ENDPOINT
        valueFrom:
        secretKeyRef:
            name: {{ include "prisoner-content-hub-feedback-exporter.fullname" . }}
            key: ELASTICSEARCH_ENDPOINT
{{- end -}}