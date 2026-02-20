import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { getConfig, setConfig, isConfigured } from './config.js';
import { listAccounts, getAccount, getAccountBalances, listAccountTransactions, getTransaction, createConsent, getConsent, deleteConsent } from './api.js';

const program = new Command();

function printSuccess(msg) { console.log(chalk.green('✓') + ' ' + msg); }
function printError(msg) { console.error(chalk.red('✗') + ' ' + msg); }
function printJson(data) { console.log(JSON.stringify(data, null, 2)); }
async function withSpinner(msg, fn) { const s = ora(msg).start(); try { const r = await fn(); s.stop(); return r; } catch (e) { s.stop(); throw e; } }
function requireAuth() { if (!isConfigured()) { printError('Token not configured.'); console.log('\nRun: obpswiss config set --token <token>'); process.exit(1); } }

program.name('obpswiss').description(chalk.bold('Swiss NextGen Banking CLI') + ' - Open Banking from your terminal').version('1.0.0');

const configCmd = program.command('config').description('Manage CLI configuration');
configCmd.command('set').option('--token <token>', 'Access token').action((opts) => { if (opts.token) { setConfig('accessToken', opts.token); printSuccess('Token set'); } });
configCmd.command('show').action(() => { console.log(chalk.bold('\nOBP Swiss Configuration\n')); console.log('Access Token: ', getConfig('accessToken') ? chalk.green('*'.repeat(20)) : chalk.red('not set')); console.log(''); });

const accountsCmd = program.command('accounts').description('Manage accounts');
accountsCmd.command('list').option('--json', 'JSON output').action(async (opts) => { requireAuth(); try { const accounts = await withSpinner('Fetching accounts...', listAccounts); if (opts.json) { printJson(accounts); } else { accounts.forEach(a => console.log(`${a.id} - ${a.accountType || 'N/A'}`)); } } catch (e) { printError(e.message); process.exit(1); } });
accountsCmd.command('get <account-id>').option('--json', 'JSON output').action(async (id, opts) => { requireAuth(); try { const account = await withSpinner('Fetching account...', () => getAccount(id)); if (opts.json) { printJson(account); } else { console.log(chalk.bold('\nAccount Details\n')); console.log('ID: ', account.id); console.log('Type: ', account.accountType || 'N/A'); } } catch (e) { printError(e.message); process.exit(1); } });
accountsCmd.command('balances <account-id>').option('--json', 'JSON output').action(async (id, opts) => { requireAuth(); try { const balances = await withSpinner('Fetching balances...', () => getAccountBalances(id)); if (opts.json) { printJson(balances); } else { balances.forEach(b => console.log(`${b.balanceType}: ${b.balanceAmount?.amount} ${b.balanceAmount?.currency || ''}`)); } } catch (e) { printError(e.message); process.exit(1); } });

const transactionsCmd = program.command('transactions').description('View transactions');
transactionsCmd.command('list <account-id>').option('--json', 'JSON output').action(async (id, opts) => { requireAuth(); try { const txns = await withSpinner('Fetching transactions...', () => listAccountTransactions(id)); if (opts.json) { printJson(txns); } else { txns.forEach(t => console.log(`${t.transactionId || t.resourceId} - ${t.transactionAmount?.amount || 'N/A'}`)); } } catch (e) { printError(e.message); process.exit(1); } });

const consentsCmd = program.command('consents').description('Manage consents');
consentsCmd.command('get <consent-id>').option('--json', 'JSON output').action(async (id, opts) => { requireAuth(); try { const consent = await withSpinner('Fetching consent...', () => getConsent(id)); if (opts.json) { printJson(consent); } else { console.log(chalk.bold('\nConsent Details\n')); console.log('ID: ', consent.consentId); console.log('Status: ', consent.consentStatus || 'N/A'); } } catch (e) { printError(e.message); process.exit(1); } });

program.parse(process.argv);
if (process.argv.length <= 2) { program.help(); }
