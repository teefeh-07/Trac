const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Usage: node micro_writer.cjs <filePath> <contentBase64> <branchName> <commitMessageBase>
// Pass content as Base64 to avoid shell escaping issues.

const filePath = process.argv[2];
const content = Buffer.from(process.argv[3], 'base64').toString('utf-8');
const branchName = process.argv[4];
const commitMsg = process.argv[5];

function run(cmd) {
    try {
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

const dir = path.dirname(filePath);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    run(`git add .`);
    run(`git commit -m "chore: create directory structure for ${path.basename(filePath)}" || echo "No changes"`);
}

// Split content into meaningful chunks (by newlines for simplicity, grouping 5 lines)
const lines = content.split('\n');
const chunkSize = 5;
let currentContent = '';

if (fs.existsSync(filePath)) {
    currentContent = fs.readFileSync(filePath, 'utf-8');
}

for (let i = 0; i < lines.length; i += chunkSize) {
    const chunk = lines.slice(i, i + chunkSize).join('\n') + '\n';

    // Append or write? 
    // If we are "creating" the file, we append.
    fs.appendFileSync(filePath, chunk);

    run(`git add "${filePath}"`);
    run(`git commit -m "${commitMsg} - part ${Math.floor(i / chunkSize) + 1}" || echo "No changes"`);
}
