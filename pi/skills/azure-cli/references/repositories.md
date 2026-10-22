# Repositories

When asked to clone an Azure DevOps repository, first get its URL:

```sh
az repos show --repository REPO --project PROJECT --org ORG_URL --query remoteUrl -o tsv
```

Choose a clear destination. Do not overwrite an existing directory:

```sh
git clone REPO_URL DIRECTORY
```

Do not clone unless the user asked for a clone or the task requires a local checkout and the user authorized it.