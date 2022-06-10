---
title: 'Known Issues'
layout: doc
---

# Known issues

## For Improvement

- **Max 25 monitors to watch in case you are using Slack notifications**, due to the limit of subrequests Cloudflare Worker can make \(50\).

  The plan is to support up to 49 by sending only one Slack notification per scheduled run.

- **KV replication lag** - You might get Slack notification instantly, however it may take couple of more seconds to see the change on your status page as [Cron Triggers are usually running on underutilized quiet hours machines](https://blog.cloudflare.com/introducing-cron-triggers-for-cloudflare-workers/#how-are-you-able-to-offer-this-feature-at-no-additional-cost).

- **Support for Durable Objects** - Cloudflare's product for low-latency coordination and consistent storage for the Workers platform. This tool should support the free tier.

## Backlog

- **Initial delay (no data)** - It takes couple of minutes to schedule and run CRON Triggers for the first time

- **Github Actions** - This repo is a monorepo build with pnpm. [link](https://developers.cloudflare.com/pages/platform/known-issues/) The wrangler 2 action has some problems with the installation of jq.

- **Worker Deployment** - It is possible to get false positives due to the nature where the cron job is executed. [Cron Triggers are usually running on underutilized quiet hours machines](https://blog.cloudflare.com/introducing-cron-triggers-for-cloudflare-workers/#how-are-you-able-to-offer-this-feature-at-no-additional-cost)
