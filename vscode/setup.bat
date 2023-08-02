@echo off

@REM winget install -e --id Microsoft.VisualStudioCode
mklink /H "%APPDATA%\Roaming\Code\User\settings.json" ".\settings.json"

code --install-extension bierner.markdown-preview-github-styles
code --install-extension christian-kohler.path-intellisense
code --install-extension DavidAnson.vscode-markdownlint
code --install-extension dbaeumer.vscode-eslint
code --install-extension EditorConfig.EditorConfig
code --install-extension esbenp.prettier-vscode
code --install-extension euskadi31.json-pretty-printer
code --install-extension GitHub.copilot
code --install-extension GitHub.github-vscode-theme
code --install-extension GitHub.vscode-pull-request-github
code --install-extension jsynowiec.vscode-insertdatestring
code --install-extension mechatroner.rainbow-csv
code --install-extension mike-co.import-sorter
code --install-extension ms-playwright.playwright
code --install-extension pomdtr.excalidraw-editor
code --install-extension streetsidesoftware.code-spell-checker
code --install-extension stylelint.vscode-stylelint
code --install-extension wayou.vscode-todo-highlight