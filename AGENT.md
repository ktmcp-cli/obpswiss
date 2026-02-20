# AGENT.md — Swiss NextGen Banking CLI for AI Agents

## Overview

The `obpswiss` CLI provides access to the Swiss NextGen Banking API (PSD2-compliant).

## Prerequisites

```bash
obpswiss config set --token <access-token>
```

## Commands

### Accounts
```bash
obpswiss accounts list --json
obpswiss accounts get <account-id> --json
obpswiss accounts balances <account-id> --json
```

### Transactions
```bash
obpswiss transactions list <account-id> --json
```

### Consents
```bash
obpswiss consents get <consent-id> --json
```

## Tips

- Always use `--json` for programmatic access
- Based on NextGenPSD2 Framework 1.3.4 (Berlin Group)
