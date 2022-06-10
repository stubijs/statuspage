---
title: 'Setup'
layout: doc
---

# Deploy on your own

## Pre-requisites

### Must Haves

You will need:

- a [Cloudflare account](https://dash.cloudflare.com/sign-up)

- a [Cloudflare Workers account](https://dash.cloudflare.com/sign-up/workers) with
  - A workers domain set up
  - The Workers Bundled subscription [For the beginning it works with Workers Free!](https://blog.cloudflare.com/workers-kv-free-tier/)

- a [Cloudflare API token](https://dash.cloudflare.com/profile/api-tokens) with the following permissions:
  - Account - Cloudflare Pages - edit
  - Account - Workers Tail - read
  - Account - Workers KV Storage - edit
  - Account - Worker Scripts - edit
  - Account - Account Settings - read
  - User - User Details - read
  - Zone - Worker Routes - edit

- a [GitHub account](https://github.com/signup)

- Some websites/APIs to watch 🙂

### Optional

- Slack incoming webhook \(optional\)
- Discord incoming webhook \(optional\)

## Deploy

1. Fork the repo [Base Repo](https://github.com/stubijs/statuspage) [how to fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo)

2. Navigate to your new **GitHub repository &gt; Settings &gt; Secrets** and add the following secrets **(DO NOT SHARE!!!)**:

::: danger

- **CF_API_TOKEN:** Your Cloudflare API token

- **CF_ACCOUNT_ID:** [Cloudflare Dashboard](https://dash.cloudflare.com/) &gt; Workers &gt; Overview &gt; Account ID (on the right side)

- **SECRET_SLACK_WEBHOOK_URL (optional):** your-slack-webhook-url

- **SECRET_DISCORD_WEBHOOK_URL (optional):** your-discord-webhook-url

:::

3. Navigate to the **GitHub repository &gt; Settings &gt; Actions &gt; General** in your repository and allow all actions and reusable workflows

4. Edit [config.yaml](./config.yaml) to adjust configuration and list all of your websites/APIs you want to monitor

5. Edit [config.ts](./packages/status-page/docs/.vitepress/config.ts) to adjust configuration of our Vitepress Installation

6. Push to `main` branch to trigger the deployment

7. _\(optional\)_ Go to Cloudflare Workers settings **[Cloudflare Dashboard](https://dash.cloudflare.com/) &gt; Workers &gt; Overview** and assign custom domain/route

8. _\(optional\)_ Edit the [CRON Trigger](https://github.com/stubijs/statuspage/blob/main/.github/workflows/worker-deploy.yml) to the Worker settings \(Default: every 5 Minutes\) [Workers Free plan](#workers-kv-free-tier)

### Telegram notifications

To enable telegram notifications, you'll need to take a few additional steps.

1. [Create a new Bot](https://core.telegram.org/bots#creating-a-new-bot)
2. Set the api token you received when creating the bot as content of the `SECRET_TELEGRAM_API_TOKEN` secret in your github repository.
3. Send a message to the bot from the telegram account which should receive the alerts (Something more than `/start`)
4. Get the chat id with `curl https://api.telegram.org/bot<YOUR TELEGRAM API TOKEN>/getUpdates | jq '.result[0] .message .chat .id'`
5. Set the retrieved chat id in the `SECRET_TELEGRAM_CHAT_ID` secret variable
6. Redeploy the status page using the github action
