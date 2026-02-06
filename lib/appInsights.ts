import { ApplicationInsights } from '@microsoft/applicationinsights-web'

let appInsights: ApplicationInsights | null = null

export function initAppInsights() {
    if (typeof window === 'undefined') return null

    const connectionString = process.env.NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING ||
        process.env.APPLICATIONINSIGHTS_CONNECTION_STRING

    if (!connectionString) {
        console.warn('Application Insights connection string not found')
        return null
    }

    if (!appInsights) {
        appInsights = new ApplicationInsights({
            config: {
                connectionString,
                enableAutoRouteTracking: true,
                enableCorsCorrelation: true,
                enableRequestHeaderTracking: true,
                enableResponseHeaderTracking: true,
                correlationHeaderExcludedDomains: ['*.queue.core.windows.net'],
                disableFetchTracking: false,
                enableAjaxErrorStatusText: true,
            }
        })

        appInsights.loadAppInsights()
        appInsights.trackPageView()
    }

    return appInsights
}

export function trackEvent(name: string, properties?: Record<string, any>) {
    if (appInsights) {
        appInsights.trackEvent({ name }, properties)
    }
}

export function trackException(error: Error, severityLevel?: number) {
    if (appInsights) {
        appInsights.trackException({
            exception: error,
            severityLevel: severityLevel || 3 // Error level
        })
    }
}

export function trackMetric(name: string, average: number, properties?: Record<string, any>) {
    if (appInsights) {
        appInsights.trackMetric({ name, average }, properties)
    }
}

export { appInsights }
