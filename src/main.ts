import * as core from '@actions/core';
import * as github from '@actions/github';

type Args = {
    repoToken: string;
}

async function run()
{
    try
    {
        const args = getAndValidateArgs();
        const client = new github.GitHub(args.repoToken);
        const context = github.context;
        const pull_request = context.payload.pull_request;

        if (!pull_request)
        {
            throw new Error("Payload is missing pull_request.");
        }

        const incompleteTaskListItem = getIncompleteCount(pull_request.body || "");

        await client.repos.createStatus({
            owner: context.issue.owner,
            repo: context.issue.repo,
            sha: pull_request.head.sha,
            state: incompleteTaskListItem === 0 ? "success" : "error",
            target_url: "https://github.com/adriangodong/actions-todo-bot",
            description: incompleteTaskListItem === 0 ? "Ready to merge" : `Found ${incompleteTaskListItem} unfinished task(s)`,
            context: "Actions TODO"
        });
    }
    catch (error)
    {
        core.setFailed(error.message);
    }
}

function getAndValidateArgs(): Args
{
    return {
        repoToken: core.getInput('repo-token', { required: true }),
    }
}

function getIncompleteCount(pullRequestBody: string)
{
    if (!pullRequestBody)
    {
        return 0;
    }
    const pullRequestBodyLines = pullRequestBody.match(/[^\r\n]+/g);
    if (pullRequestBodyLines === null)
    {
        return 0;
    }

    let incompleteCount = 0;
    for (const line of pullRequestBodyLines)
    {
        if (line.trim().startsWith("- [ ]"))
        {
            incompleteCount++;
        }
    }
    return incompleteCount;
}

run();
