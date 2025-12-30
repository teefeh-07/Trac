const { execSync } = require('child_process');

function run(cmd) {
    try {
        return execSync(cmd).toString().trim();
    } catch (e) {
        console.error(`Command failed: ${cmd}`);
        return null;
    }
}

function getBranches() {
    const output = run('git branch --format="%(refname:short)"');
    return output.split('\n').filter(b => b.startsWith('feat/') || b.startsWith('docs/') || b.startsWith('test/'));
}

async function main() {
    const branches = getBranches();
    console.log(`Found ${branches.length} feature branches.`);

    for (const branch of branches) {
        console.log(`Processing PR for ${branch}...`);

        // Push branch if not pushed (handling the automation script local branches)
        run(`git push origin ${branch}`);

        // Generate description
        const title = `PR: ${branch.split('/')[1].replace(/-/g, ' ')}`;
        const body = `
## Description
This PR implements the features and changes for **${branch}**.

### Changes
- Implemented core logic for the component.
- Added necessary configuration.
- Updated documentation.
- Added unit tests.

### Type of Change
- [x] New Feature
- [ ] Bug Fix
- [ ] Documentation Update
        `.trim();

        // Create PR
        // Note: This requires 'gh' CLI to be installed and authenticated
        const prCmd = `gh pr create --title "${title}" --body "${body}" --head ${branch} --base main`;
        console.log(`Running: ${prCmd}`);
        const prUrl = run(prCmd);

        if (prUrl) {
            console.log(`PR Created: ${prUrl}`);
            // Auto-merge
            run(`gh pr merge ${branch} --merge --auto`);
        }
    }
}

main();
