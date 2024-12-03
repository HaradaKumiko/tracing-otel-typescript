import { diag, DiagConsoleLogger, DiagLogLevel }  from "@opentelemetry/api";
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PeriodicExportingMetricReader, ConsoleMetricExporter } from '@opentelemetry/sdk-metrics';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

export default function SetupTracing() {
    const sdk = new NodeSDK({
      traceExporter: new OTLPTraceExporter({
        url: 'http://localhost:4318/v1/traces',
        // url: 'https://staging-http-orion.comtelindo.com/v1/traces', // Match the NGINX config
      }),
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'imtext-backend-service',
        [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0'
      }),
      metricReader: new PeriodicExportingMetricReader({
        exporter: new ConsoleMetricExporter(),
      }),
      instrumentations: [getNodeAutoInstrumentations()],
    });
  
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);
  
    return sdk;
  }
