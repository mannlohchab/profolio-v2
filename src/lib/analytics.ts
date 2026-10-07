import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
import posthog from 'posthog-js';

let ready = false;

/** True when a PostHog project key is configured. */
export function analyticsEnabled() {
	return Boolean(browser && env.PUBLIC_POSTHOG_KEY);
}

/** Initialize PostHog once on the client. No-op without PUBLIC_POSTHOG_KEY. */
export function initAnalytics() {
	if (!analyticsEnabled() || ready) return;

	posthog.init(env.PUBLIC_POSTHOG_KEY!, {
		api_host: env.PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
		defaults: '2025-05-24',
		person_profiles: 'identified_only',
		capture_pageview: false,
		capture_pageleave: true,
		autocapture: true
	});

	ready = true;
}

/** Manual SPA pageview — call from afterNavigate. */
export function capturePageview() {
	if (!analyticsEnabled() || !ready) return;
	posthog.capture('$pageview');
}

export { posthog };
