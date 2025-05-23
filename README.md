<div align="center">
  <img src="./logo.png" alt="Nekomi Logo" width="200" height="200" style="border-radius: 16px;" />
</div>

# Nekomi Discord Bot

[![Node.js](https://img.shields.io/badge/node-%3E=22.0.0-green.svg?style=flat-square)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/package%20manager-pnpm-f69220?style=flat-square)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/language-typescript-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io/)

Nekomi is a cute Discord bot that delivers a random cat picture or gif every day, straight to your channel. Use the `/neko` slash command for an instant cat delivery, or let Nekomi automatically send one daily! Perfect for adding some daily cuteness to your server. 🐾

## Features

- **Daily Cat Drops:** Automatically posts a random cat image to your chosen channel every day at your scheduled time.
- **Slash Commands:**
  - `/neko` — Get a random cute cat image!
  - `/nekoschedule` — Check when Nekomi posts her daily cat photo!
  - `/setnekoschedule` — Set the channel and time for the daily Neko schedule. _(Options: `channel` (required), `time` (required, 24hr format HH:mm))_
  - `/removenekoschedule` — Remove the channel for the daily Neko schedule.
- **Written in TypeScript** for type safety and maintainability.
- **Prettier** for consistent code style.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v22+ recommended)
- [pnpm](https://pnpm.io/) (used for dependency management)

### Installation

```bash
pnpm install
```

### Environment Variables

Create a `.env` file in the root directory with the following:

```env
DISCORD_TOKEN=your-bot-token-here
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-anon-key
```

### Persistent Storage: Supabase

Nekomi uses [Supabase](https://supabase.com/) for all persistent storage.

#### Supabase Setup

1. **Create a free Supabase project** at [https://supabase.com/](https://supabase.com/).
2. **Create the required table** using the SQL editor:

   ```sql
   create table if not exists public.guild_channels (
     guild_id text primary key,
     channel_id text not null,
     time varchar(5) not null
   );
   ```

3. **Get your project credentials:**
   - `SUPABASE_URL` (Project URL)
   - `SUPABASE_KEY` (Anon public key)
4. **Add these to your `.env` file** as shown above.

**Note:** All schedule channel data is stored securely in your Supabase database.

### Scripts

- `pnpm start` — Start the bot (production or normal run)
- `pnpm dev` — Start the bot in watch mode for development
- `pnpm format` — Format the codebase with Prettier
- `pnpm format:check` — Check code formatting with Prettier
- `pnpm lint` — Run ESLint on the codebase
- `pnpm type-check` — Run TypeScript type checking without emitting files

### Running the Bot

```bash
pnpm start
```

## Running on VPS

To run the Nekomi bot on a VPS or production server, it is recommended to use [PM2](https://pm2.keymetrics.io/) as a process manager. PM2 ensures your bot stays online, restarts on failure, and manages logs efficiently.

Below is a sample `pm2.config.js` configuration for running the bot using the Bun runtime. This setup logs output and errors to the `./logs` directory and sets different environments for development and production.

```js
// pm2.config.js
module.exports = {
  apps: [
    {
      name: 'nekomi',
      script: './src/index.ts',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '480M',
      error_file: './logs/pm2-err.log',
      out_file: './logs/pm2-out.log',
      interpreter: 'bun', // Bun interpreter
      env: {
        NODE_ENV: 'development',
        WATCH: 'true',
        PATH: `${process.env.HOME}/.bun/bin:${process.env.PATH}`,
      },
      env_production: {
        NODE_ENV: 'production',
        WATCH: 'false',
      },
    },
  ],
};
```

## Contributing

Pull requests and issues are welcome! Please ensure code style is consistent by running Prettier before submitting.

## License

MIT
