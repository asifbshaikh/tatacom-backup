<p align="center">
  <img src="https://s3.us-west-2.amazonaws.com/gh-assets.tring.com/brand.svg" alt="Woot-logo" width="240" />

  <p align="center">Customer engagement suite, an open-source alternative to Intercom, Zendesk, Salesforce Service Cloud etc.</p>
</p>

<p align="center">
  <a href="https://heroku.com/deploy?template=https://github.com/tring/tring/tree/master" alt="Deploy to Heroku">
     <img width="150" alt="Deploy" src="https://www.herokucdn.com/deploy/button.svg"/>
  </a>
  <a href="https://marketplace.digitalocean.com/apps/tring?refcode=f2238426a2a8" alt="Deploy to DigitalOcean">
     <img width="200" alt="Deploy to DO" src="https://www.deploytodo.com/do-btn-blue.svg"/>
  </a>
</p>

___

<p align="center">
  <a href="https://codeclimate.com/github/tring/tring/maintainability"><img src="https://api.codeclimate.com/v1/badges/80f9e1a7c72d186289ad/maintainability" alt="Maintainability"></a>
  <img src="https://img.shields.io/circleci/build/github/tring/tring" alt="CircleCI Badge">
    <a href="https://hub.docker.com/r/tring/tring/"><img src="https://img.shields.io/docker/pulls/tring/tring" alt="Docker Pull Badge"></a>
  <a href="https://hub.docker.com/r/tring/tring/"><img src="https://img.shields.io/docker/cloud/build/tring/tring" alt="Docker Build Badge"></a>
  <img src="https://img.shields.io/github/commit-activity/m/tring/tring" alt="Commits-per-month">
  <a title="Crowdin" target="_self" href="https://tring.crowdin.com/tring"><img src="https://badges.crowdin.net/e/37ced7eba411064bd792feb3b7a28b16/localized.svg"></a>
  <a href="https://discord.gg/cJXdrwS"><img src="https://img.shields.io/discord/647412545203994635" alt="Discord"></a>
  <a href="https://huntr.dev/bounties/disclose"><img src="https://cdn.huntr.dev/huntr_security_badge_mono.svg" alt="Huntr"></a>
  <a href="https://status.tring.com"><img src="https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Ftring%2Fstatus%2Fmaster%2Fapi%2Ftring%2Fuptime.json" alt="uptime"></a>
  <a href="https://status.tring.com"><img src="https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Ftring%2Fstatus%2Fmaster%2Fapi%2Ftring%2Fresponse-time.json" alt="response time"></a>
</p>

<img src="https://tring-public-assets.s3.amazonaws.com/github/screenshot.png" width="100%" alt="Chat dashboard"/>



Tring is an open-source, self-hosted customer engagement suite. Tring lets you view and manage your customer data, communicate with them irrespective of which medium they use, and re-engage them based on their profile.

## Features

Tring supports the following conversation channels:

 - **Website**: Talk to your customers using our live chat widget and make use of our SDK to identify a user and provide contextual support.
 - **Facebook**: Connect your Facebook pages and start replying to the direct messages to your page.
 - **Instagram**: Connect your Instagram profile and start replying to the direct messages.
 - **Twitter**: Connect your Twitter profiles and reply to direct messages or the tweets where you are mentioned.
 - **Telegram**: Connect your Telegram bot and reply to your customers right from a single dashboard.
 - **WhatsApp**: Connect your WhatsApp business account and manage the conversation in Tring.
 - **Line**: Connect your Line account and manage the conversations in Tring.
 - **SMS**: Connect your Twilio SMS account and reply to the SMS queries in Tring.
 - **API Channel**: Build custom communication channels using our API channel.
 - **Email**: Forward all your email queries to Tring and view it in our integrated dashboard.

And more.

Other features include:

- **CRM**: Save all your customer information right inside Tring, use contact notes to log emails, phone calls, or meeting notes.
- **Custom Attributes**: Define custom attribute attributes to store information about a contact or a conversation and extend the product to match your workflow.
- **Shared multi-brand inboxes**: Manage multiple brands or pages using a shared inbox.
- **Private notes**: Use @mentions and private notes to communicate internally about a conversation.
- **Canned responses (Saved replies)**: Improve the response rate by adding saved replies for frequently asked questions.
- **Conversation Labels**: Use conversation labels to create custom workflows.
- **Auto assignment**: Tring intelligently assigns a ticket to the agents who have access to the inbox depending on their availability and load.
- **Conversation continuity**: If the user has provided an email address through the chat widget, Tring will send an email to the customer under the agent name so that the user can continue the conversation over the email.
- **Multi-lingual support**: Tring supports 10+ languages.
- **Powerful API & Webhooks**: Extend the capability of the software using Tring’s webhooks and APIs.
- **Integrations**: Tring natively integrates with Slack right now. Manage your conversations in Slack without logging into the dashboard.

## Documentation

Detailed documentation is available at [tring.com/help-center](https://www.tring.com/help-center).

## Translation process

The translation process for Tring web and mobile app is managed at [https://translate.tring.com](https://translate.tring.com) using Crowdin. Please read the [translation guide](https://www.tring.com/docs/contributing/translating-tring-to-your-language) for contributing to Tring.

## Branching model

We use the [git-flow](https://nvie.com/posts/a-successful-git-branching-model/) branching model. The base branch is `develop`.
If you are looking for a stable version, please use the `master` or tags labelled as `v1.x.x`.

## Deployment

### Heroku one-click deploy

Deploying Tring to Heroku is a breeze. It's as simple as clicking this button:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/tring/tring/tree/master)

Follow this [link](https://www.tring.com/docs/environment-variables) to understand setting the correct environment variables for the app to work with all the features. There might be breakages if you do not set the relevant environment variables.


### DigitalOcean 1-Click Kubernetes deployment

Tring now supports 1-Click deployment to DigitalOcean as a kubernetes app.

<a href="https://marketplace.digitalocean.com/apps/tring?refcode=f2238426a2a8" alt="Deploy to DigitalOcean">
  <img width="200" alt="Deploy to DO" src="https://www.deploytodo.com/do-btn-blue.svg"/>
</a>

### Other deployment options

For other supported options, checkout our [deployment page](https://tring.com/deploy). 

## Security

Looking to report a vulnerability? Please refer our [SECURITY.md](./SECURITY.md) file.


## Community? Questions? Support ?

If you need help or just want to hang out, come, say hi on our [Discord](https://discord.gg/cJXdrwS) server.


## Contributors ✨

Thanks goes to all these [wonderful people](https://www.tring.com/docs/contributors):

<a href="https://github.com/tring/tring/graphs/contributors"><img src="https://opencollective.com/tring/contributors.svg?width=890&button=false" /></a>


*Tring* &copy; 2017-2022, Tring Inc - Released under the MIT License.
