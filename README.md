> "Six months ago, everyone was talking about MCPs. And I was like, screw MCPs. Every MCP would be better as a CLI."
>
> — [Peter Steinberger](https://twitter.com/steipete), Founder of OpenClaw  
> [Watch on YouTube (~2:39:00)](https://www.youtube.com/@lexfridman) | [Lex Fridman Podcast #491](https://lexfridman.com/peter-steinberger/)

# Swiss NextGen Banking CLI

A production-ready command-line interface for the Swiss Open Banking API. Manage PSD2-compliant banking operations including accounts, transactions, consents, and payments.

## Features

- **Accounts** — List accounts and view balances
- **Transactions** — Access transaction history
- **Consents** — Manage account information consents
- **Payments** — Initiate payments (single, bulk, periodic)
- **JSON output** — All commands support `--json`

## Installation

```bash
npm install -g @ktmcp-cli/obpswiss
```

## Authentication

Configure your access token:

```bash
obpswiss config set --token YOUR_ACCESS_TOKEN
```

## Commands

### Accounts

```bash
obpswiss accounts list
obpswiss accounts get <account-id>
obpswiss accounts balances <account-id>
```

### Transactions

```bash
obpswiss transactions list <account-id>
```

### Consents

```bash
obpswiss consents get <consent-id>
```

## JSON Output

```bash
obpswiss accounts list --json
obpswiss transactions list <account-id> --json | jq '.[] | {id, amount}'
```

## License

MIT — see [LICENSE](LICENSE) for details.

---

Part of the [KTMCP CLI](https://killthemcp.com) project.
