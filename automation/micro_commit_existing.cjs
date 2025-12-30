const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Usage: node micro_commit_existing.cjs <filePath> <branchName> <commitMessageBase>

const filePath = process.argv[2];
const branchName = process.argv[3];
const commitMsg = process.argv[4];

function run(cmd) {
    try {
        console.log(`Running: ${cmd}`);
        execSync(cmd, { stdio: 'pipe' });
    } catch (e) {
        console.error(`Cmd failed: ${cmd}`);
    }
}

if (branchName) {
    try {
        run(`git checkout -b ${branchName}`);
    } catch (e) {
        run(`git checkout ${branchName}`);
    }
}

if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');
const chunkSize = 3; // Small chunks for more commits!

// Clear file
fs.writeFileSync(filePath, '');
run(`git add "${filePath}"`);
run(`git commit -m "chore: initialize ${path.basename(filePath)}" || echo "No changes"`);

for (let i = 0; i < lines.length; i += chunkSize) {
    const chunk = lines.slice(i, i + chunkSize).join('\n') + '\n';

    fs.appendFileSync(filePath, chunk);

    run(`git add "${filePath}"`);
    run(`git commit -m "${commitMsg} - part ${Math.floor(i / chunkSize) + 1}"`);
}
