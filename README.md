# Buffer Ideas — Obsidian Plugin

Send your Obsidian notes to [Buffer](https://buffer.com) as ideas with one click.

The note's filename becomes the idea title, and the note's content becomes the idea body.

Built on top of the [Obsidian sample plugin](https://github.com/obsidianmd/obsidian-sample-plugin).

## Features

- Ribbon icon to send the current note to Buffer as an idea
- Command palette support ("Send current note to Buffer as idea")
- Secure API token storage via Obsidian's built-in SecretStorage (system keychain — never stored in plaintext)

## Setup

1. Install the plugin and enable it in Obsidian settings.
2. Go to **Settings → Buffer Ideas**.
3. Select or create a secret containing your Buffer API token.
4. Open any note and click the send icon in the ribbon (or use the command palette).

## Development

Built with TypeScript and the Obsidian plugin API.

```bash
npm install       # install dependencies
npm run dev       # watch mode — compiles main.ts to main.js
npm run build     # type-check + production build
npm run lint      # run ESLint
```

Place the plugin folder inside your vault at `.obsidian/plugins/buffer-plugin/` and enable it in Obsidian settings.
