"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const args = getAndValidateArgs();
            const client = new github.GitHub(args.repoToken);
            const context = github.context;
            const pull_request = context.payload.pull_request;
            if (!pull_request) {
                throw new Error("Payload is missing pull_request.");
            }
            const incompleteTaskListItem = getIncompleteCount(pull_request.body || "");
            yield client.repos.createStatus({
                owner: context.issue.owner,
                repo: context.issue.repo,
                sha: pull_request.head.sha,
                state: incompleteTaskListItem === 0 ? "success" : "error",
                target_url: "https://github.com/adriangodong/actions-todo-bot",
                description: incompleteTaskListItem === 0 ? "Ready to merge" : `Found ${incompleteTaskListItem} unfinished task(s)`,
                context: "Actions TODO"
            });
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
function getAndValidateArgs() {
    return {
        repoToken: core.getInput('repo-token', { required: true }),
    };
}
function getIncompleteCount(pullRequestBody) {
    if (!pullRequestBody) {
        return 0;
    }
    const pullRequestBodyLines = pullRequestBody.match(/[^\r\n]+/g);
    if (pullRequestBodyLines === null) {
        return 0;
    }
    let incompleteCount = 0;
    for (const line of pullRequestBodyLines) {
        if (line.trim().startsWith("- [ ]")) {
            incompleteCount++;
        }
    }
    return incompleteCount;
}
run();
