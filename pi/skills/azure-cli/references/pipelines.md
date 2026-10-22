# Pipeline failures

Find failed PR pipeline runs, then match each run to the PR by branch or commit:

```sh
az pipelines runs list --reason pullRequest --result failed --org ORG_URL --project PROJECT -o json
```

Inspect the run:

```sh
az pipelines runs show --id RUN_ID --org ORG_URL --project PROJECT -o json
```

A run summary is not enough to identify the cause. Read its failed tasks and log metadata:

```sh
az devops invoke --area build --resource timeline --route-parameters project=PROJECT buildId=RUN_ID -o json
az devops invoke --area build --resource logs --route-parameters project=PROJECT buildId=RUN_ID -o json
```

Fetch an individual text log by adding `logId=LOG_ID` to the second command and using `--out-file NEW_FILE`. Identify the failed job or step and the relevant error or test assertion. Do not queue or rerun a pipeline while investigating.