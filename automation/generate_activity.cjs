const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TOTAL_BRANCHES = 80;
const COMMITS_PER_BRANCH = 10;

const TASKS = [
  'project-init', 'setup-ci', 'config-update', 'add-dependencies', 'refactor-utils',
  'docs-update', 'test-coverage', 'ui-layout', 'ui-header', 'ui-footer',
  'ui-sidebar', 'ui-button', 'ui-input', 'ui-form', 'ui-modal',
  'ui-card', 'ui-table', 'ui-list', 'ui-icon', 'ui-theme',
  'auth-login', 'auth-register', 'auth-recover', 'auth-2fa', 'auth-oauth',
  'api-client', 'api-endpoints', 'api-interceptors', 'api-mock', 'api-types',
  'store-user', 'store-settings', 'store-data', 'store-cache', 'store-sync',
  'web3-connect', 'web3-wallet', 'web3-transaction', 'web3-contract', 'web3-events',
  'chainhook-listener', 'chainhook-parser', 'chainhook-store', 'chainhook-ui', 'chainhook-retry',
  'contract-trait', 'contract-dao', 'contract-token', 'contract-vesting', 'contract-voting',
  'guard-admin', 'guard-moderator', 'guard-user', 'guard-guest', 'guard-bot',
  'util-date', 'util-string', 'util-number', 'util-array', 'util-object',
  'test-e2e', 'test-unit', 'test-integration', 'test-smoke', 'test-perf',
  'deploy-script', 'deploy-config', 'deploy-audit', 'deploy-verify', 'deploy-rollback',
  'optimize-build', 'optimize-images', 'optimize-fonts', 'optimize-bundles', 'optimize-css',
  'a11y-audit', 'a11y-labels', 'a11y-focus', 'a11y-contrast', 'a11y-nav',
  'seo-meta', 'seo-sitemap', 'seo-robots', 'seo-schema', 'seo-analytics'
];

// Ensure we have enough tasks
while (TASKS.length < TOTAL_BRANCHES) {
    TASKS.push(`generated-feature-${TASKS.length}`);
}

const LOG_FILE = 'ACTIVITY_LOG.md';

function run(cmd) {
    try {
        execSync(cmd, { stdio: 'pipe' });
    } catch (e) {
        // console.log(`Command failed: ${cmd}`, e.message);
    }
}

function randomCommitMessage(task) {
    const types = ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore'];
    const type = types[Math.floor(Math.random() * types.length)];
    const msgs = [
        'update internal logic', 'refactor code structure', 'add comments',
        'fix minor typo', 'optimize performance', 'update configuration',
        'refine types', 'clean up whitespace', 'enhance error handling',
        'update documentation'
    ];
    return `${type}: ${task} - ${msgs[Math.floor(Math.random() * msgs.length)]}`;
}

async function main() {
    console.log('Starting Micro-Commit Strategy...');

    if (!fs.existsSync(LOG_FILE)) {
        fs.writeFileSync(LOG_FILE, '# Project Activity Log\n\n');
    }

    // Iterate through tasks/branches
    for (let i = 0; i < TASKS.length; i++) {
        const task = TASKS[i];
        const branchName = `feat/${task}`;
        
        console.log(`[${i+1}/${TASKS.length}] Processing branch: ${branchName}`);
        
        // Create/Checkout branch
        run(`git checkout -b ${branchName}`);
        
        // Generate Micro-Commits
        for (let j = 0; j < COMMITS_PER_BRANCH; j++) {
            // Modify file
            const timestamp = new Date().toISOString();
            const logEntry = `- [${timestamp}] Update for ${task} part ${j+1}\n`;
            fs.appendFileSync(LOG_FILE, logEntry);
            
            // Add other dummy files occasionally
            if (Math.random() > 0.7) {
                const dummyFile = `src/components/${task}.txt`;
                if (!fs.existsSync(path.dirname(dummyFile))) {
                    fs.mkdirSync(path.dirname(dummyFile), { recursive: true });
                }
                fs.writeFileSync(dummyFile, `Log ${timestamp}`);
                run(`git add ${dummyFile}`);
            }

            // Git operations
            run(`git add ${LOG_FILE}`);
            const msg = randomCommitMessage(task);
            run(`git commit -m "${msg}"`);
        }
        
        // Push branch (optional, can be very slow if 80 pushes)
        // run(`git push origin ${branchName}`);
        
        // Switch back to main to branch off again? 
        // Or branch off the previous?
        // Usually feature branches come from main.
        run(`git checkout main`);
        
    }
    
    console.log('Automation Complete.');
}

main();
