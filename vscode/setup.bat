@echo off

@REM winget install -e --id Microsoft.VisualStudioCode
mklink /H "%APPDATA%\Code\User\settings.json" ".\settings.json"

call code --install-extension bierner.markdown-preview-github-styles
call code --install-extension christian-kohler.path-intellisense
call code --install-extension DavidAnson.vscode-markdownlint
call code --install-extension dbaeumer.vscode-eslint
call code --install-extension EditorConfig.EditorConfig
call code --install-extension esbenp.prettier-vscode
call code --install-extension euskadi31.json-pretty-printer
call code --install-extension GitHub.copilot
call code --install-extension GitHub.github-vscode-theme
call code --install-extension GitHub.vscode-pull-request-github
call code --install-extension jsynowiec.vscode-insertdatestring
call code --install-extension mechatroner.rainbow-csv
call code --install-extension mike-co.import-sorter
call code --install-extension ms-playwright.playwright
call code --install-extension pomdtr.excalidraw-editor
call code --install-extension streetsidesoftware.code-spell-checker
call code --install-extension stylelint.vscode-stylelint
call code --install-extension wayou.vscode-todo-highlight