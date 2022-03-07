# GitHub Actions TODO Bot

This action parses PR description and set commit status to success if there are no unfilled checkbox.

## Using the Action

Create a new workflow YAML file under `.github/workflows/` folder.

Example:

```
name: TODO Bot

on:
  pull_request:
    types: [opened, synchronize, reopened, edited]

jobs:
  check:

    runs-on: ubuntu-latest

    steps:
    - uses: adriangodong/actions-todo-bot@1.0.0
      with:
        repo-token: ${{ secrets.GITHUB_TOKEN }}
```

## Development / Release

* The default target branch for code changes is `master`
* To prepare a test version:
  * Fork the target commit into a release branch
  * Modify .gitignore file to not exclude `node_modules` folder
  * Run `npm ci --only=prod` and `npm run build`
  * Commit all the changes
* To release a version:
  * Tag the target commit from the release branch
