import { App, PluginSettingTab, SecretComponent, Setting } from "obsidian";
import BufferPlugin from "./main";

export interface BufferPluginSettings {
	apiTokenSecret: string;
}

export const DEFAULT_SETTINGS: BufferPluginSettings = {
	apiTokenSecret: "",
};

export class BufferSettingTab extends PluginSettingTab {
	plugin: BufferPlugin;

	constructor(app: App, plugin: BufferPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h2", { text: "Buffer Ideas" });

		new Setting(containerEl)
			.setName("Buffer API token")
			.setDesc("Select a secret from SecretStorage.")
			.addComponent(el => new SecretComponent(this.app, el)
				.setValue(this.plugin.settings.apiTokenSecret)
				.onChange(async (value) => {
					this.plugin.settings.apiTokenSecret = value;
					await this.plugin.saveSettings();
				}));
	}
}
