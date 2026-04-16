import { MarkdownView, Notice, Plugin } from "obsidian";
import { BufferPluginSettings, BufferSettingTab, DEFAULT_SETTINGS } from "./settings";
import { createBufferIdea, getBufferOrganizations } from "./buffer-api";


export default class BufferPlugin extends Plugin {
	settings: BufferPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addRibbonIcon("send", "Send to Buffer as idea", () => {
			this.sendCurrentNoteToBuffer();
		});

		this.addCommand({
			id: "send-to-buffer-idea",
			name: "Send current note to Buffer as idea",
			checkCallback: (checking: boolean) => {
				const view = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!view) return false;
				if (!checking) this.sendCurrentNoteToBuffer();
				return true;
			},
		});

		this.addSettingTab(new BufferSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<BufferPluginSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private async sendCurrentNoteToBuffer() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) {
			new Notice("No active note to send.");
			return;
		}

		const raw = view.editor.getValue().trim();
		if (!raw) {
			new Notice("The current note is empty.");
			return;
		}

		const apiToken = this.app.secretStorage.getSecret(this.settings.apiTokenSecret);
		if (!apiToken) {
			new Notice("Buffer API token not set. Go to Settings → Buffer Ideas.");
			return;
		}

		const title = view.file?.basename ?? "Untitled";
		const text = raw;

		new Notice("Sending to Buffer…");

		try {
			const orgs = await getBufferOrganizations(apiToken);
			if (orgs.length === 0) throw new Error("No organizations found for this token.");
			await createBufferIdea(apiToken, orgs[0]!.id, title, text);
			new Notice("Idea sent to Buffer!");
		} catch (err) {
			console.error("Buffer Ideas plugin error:", err);
			new Notice(`Failed to send to Buffer: ${(err as Error).message}`);
		}
	}
}
