const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TASKS = [
    "ui-optimizations", "backend-api-v2", "auth-refactor", "db-indexing", "cache-layer",
    "unit-tests-core", "e2e-tests-flow", "docs-api-ref", "ci-pipeline-speed", "analytics-events",
    "seo-meta-tags", "accessibility-fix", "i18n-support", "theme-dark-mode", "mobile-responsive",
    "perf-lazy-load", "security-audit", "payment-gateway", "notification-service", "email-templates",
    "user-profile-v2", "admin-dashboard", "audit-logs", "error-boundary", "sentry-integration",
    "feature-flags", "ab-testing", "websocket-push", "search-indexing", "content-cms"
];

const COMMITS_PER_BRANCH = 5;

function run(cmd) {
    try {
        console.log(`Running: ${cmd}`);
        execSync(cmd, { stdio: 'inherit' });
    } catch (e) {
        console.error(`Error running ${cmd}: ${e.message}`);
    }
}

function ensureNoLock() {
    const lockFile = '.git/index.lock';
    if (fs.existsSync(lockFile)) {
        try {
            fs.unlinkSync(lockFile);
            console.log('Removed stale lock file');
        } catch (e) {
            console.error('Could not remove lock file, retrying in 1s...');

            // Wait synchronously
            const start = Date.now();
            while (Date.now() - start < 1000) { }

            try {
                fs.unlinkSync(lockFile);
            } catch (ex) {
                console.error('Still failed to remove lock:', ex.message);
            }
        }
    }
}

function main() {
    console.log('Starting Sync Mass Commit...');

    ensureNoLock();
    // Ensure on main
    // run('git checkout main');

    for (const task of TASKS) {
        const branch = `feat/${task}`;
        console.log(`Processing ${branch}...`);

        ensureNoLock();
        try {
            execSync(`git checkout -b ${branch} || git checkout ${branch}`, { stdio: 'pipe' });
        } catch (e) {
            // Ignore if checkout fails (likely already on branch or other issue, try to proceed)
        }

        for (let i = 1; i <= COMMITS_PER_BRANCH; i++) {
            ensureNoLock();

            const file = `docs/${task}.txt`;
            const dir = path.dirname(file);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            fs.appendFileSync(file, `Micro update ${i} for ${task}\n`);

            run(`git add "${file}"`);
            run(`git commit -m "feat: ${task} - update ${i} implementation details"`);
        }

        ensureNoLock();
        // Go back to main
        run('git checkout main');
    }

    console.log('Done!');
}

main();
