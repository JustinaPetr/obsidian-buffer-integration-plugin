import { requestUrl } from "obsidian";

const BUFFER_GRAPHQL_ENDPOINT = "https://api.buffer.com/graphql";

export interface BufferOrganization {
	id: string;
	name: string;
	ownerEmail: string;
}

export interface CreateIdeaResult {
	id: string;
	content: {
		title: string;
		text: string;
	};
}

export async function getBufferOrganizations(apiToken: string): Promise<BufferOrganization[]> {
	const query = `
		query GetOrganizations {
			account {
				organizations {
					id
					name
					ownerEmail
				}
			}
		}
	`;

	const json = await bufferRequest<{ account: { organizations: BufferOrganization[] } }>(apiToken, query);
	return json.account.organizations;
}

export async function createBufferIdea(
	apiToken: string,
	organizationId: string,
	title: string,
	text: string
): Promise<CreateIdeaResult> {
	const mutation = `
		mutation CreateIdea($organizationId: ID!, $title: String!, $text: String!) {
			createIdea(input: {
				organizationId: $organizationId,
				content: {
					title: $title,
					text: $text
				}
			}) {
				... on Idea {
					id
					content {
						title
						text
					}
				}
			}
		}
	`;

	const json = await bufferRequest<{ createIdea: CreateIdeaResult }>(apiToken, mutation, {
		organizationId,
		title,
		text,
	});

	if (!json.createIdea?.id) {
		throw new Error("Buffer API returned an unexpected response");
	}

	return json.createIdea;
}

async function bufferRequest<T>(
	apiToken: string,
	query: string,
	variables?: Record<string, string>
): Promise<T> {
	const response = await requestUrl({
		url: BUFFER_GRAPHQL_ENDPOINT,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${apiToken}`,
		},
		body: JSON.stringify({ query, variables }),
		throw: false,
	});

	if (response.status < 200 || response.status >= 300) {
		throw new Error(`Buffer API request failed: ${response.status} — ${response.text}`);
	}

	const json = response.json as { data?: T; errors?: { message: string }[] };

	if (json.errors && json.errors.length > 0) {
		throw new Error(`Buffer API error: ${json.errors.map((e) => e.message).join(", ")}`);
	}

	if (!json.data) {
		throw new Error("Buffer API returned an empty response");
	}

	return json.data;
}
