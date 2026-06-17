```
NOTE: USE ONLY MY APIs not and dummy API
NOTE: USE JSX NOT TSX FOR MAKING IT
NOTE: Everything should be polished and professional.
NOTE: First make a plan and design before doing anything
NOTE: Make the terminal using xterm.js for the frontend
create an frontend of sandbox like application where user will have an start button to create the sandbox after creation user can chat with AI to generate frontend he wants... the user will also have the terminal access with frontend preview, use tailwindcss for styling.

use this data for api integration and terminal integration with socket.io:
```
1. Create Sandbox: POST http://localhost/api/sandbox/start

    this api will create an sandbox and return the sandboxId and the sandboxPreview link

    example response:
    {
        "message": "Sandbox environtment created successfully",
        "sandboxId": "019ecfcf-4506-77ea-bd77-356fdcfc8b79",
        "previewURL": "http://019ecfcf-4506-77ea-bd77-356fdcfc8b79.preview.localhost" // create iframe using this previewURL
    }

2. List Files: GET http://019ecfcf-4506-77ea-bd77-356fdcfc8b79.agent.localhost/list-files

    this api will return all the files in the root directory

    example response:
    {
        "message": "Files listed successfully",
        "files": [
            ".dockerignore",
            ".gitignore",
            "README.md",
            "dockerfile",
            "eslint.config.js",
            "index.html",
            "package-lock.json",
            "package.json",
            "public/favicon.svg",
            "public/icons.svg",
            "src/App.css",
            "src/App.jsx",
            "src/assets/hero.png",
            "src/assets/react.svg",
            "src/assets/vite.svg",
            "src/index.css",
            "src/main.jsx",
            "vite.config.js"
        ]
    }

3. Update files: PATCH http://019ecfcf-4506-77ea-bd77-356fdcfc8b79.agent.localhost/update-files

this api will take files and content to update code of and update files

example body to send:
    {
    "updates": [{ "file": "src/App.jsx", "content": "import { useState } from 'react'\nimport reactLogo from './assets/react.svg'\nimport viteLogo from './assets/vite.svg'\nimport heroImg from './assets/hero.png'\nimport './App.css'\n\nfunction App() {\n  const [count, setCount] = useState(0)\n\n  return (\n    <>\n      <section id=\"center\">\n        <div className=\"hero\">\n          <img src={heroImg} className=\"base\" width=\"170\" height=\"179\" alt=\"\" />\n          <img src={reactLogo} className=\"framework\" alt=\"React logo\" />\n          <img src={viteLogo} className=\"vite\" alt=\"Vite logo\" />\n        </div>\n        <div>\n          <h1>The Cohort</h1>\n          <p>\n            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>\n          </p>\n        </div>\n        <button\n          type=\"button\"\n          className=\"counter\"\n          onClick={() => setCount((count) => count + 1)}\n        >\n          Count is {count}\n        </button>\n      </section>\n\n      <div className=\"ticks\"></div>\n\n      <section id=\"next-steps\">\n        <div id=\"docs\">\n          <svg className=\"icon\" role=\"presentation\" aria-hidden=\"true\">\n            <use href=\"/icons.svg#documentation-icon\"></use>\n          </svg>\n          <h2>Documentation</h2>\n          <p>Your questions, answered</p>\n          <ul>\n            <li>\n              <a href=\"https://vite.dev/\" target=\"_blank\">\n                <img className=\"logo\" src={viteLogo} alt=\"\" />\n                Explore Vite\n              </a>\n            </li>\n            <li>\n              <a href=\"https://react.dev/\" target=\"_blank\">\n                <img className=\"button-icon\" src={reactLogo} alt=\"\" />\n                Learn more\n              </a>\n            </li>\n          </ul>\n        </div>\n        <div id=\"social\">\n          <svg className=\"icon\" role=\"presentation\" aria-hidden=\"true\">\n            <use href=\"/icons.svg#social-icon\"></use>\n          </svg>\n          <h2>Connect with us</h2>\n          <p>Join the Vite community</p>\n          <ul>\n            <li>\n              <a href=\"https://github.com/vitejs/vite\" target=\"_blank\">\n                <svg\n                  className=\"button-icon\"\n                  role=\"presentation\"\n                  aria-hidden=\"true\"\n                >\n                  <use href=\"/icons.svg#github-icon\"></use>\n                </svg>\n                GitHub\n              </a>\n            </li>\n            <li>\n              <a href=\"https://chat.vite.dev/\" target=\"_blank\">\n                <svg\n                  className=\"button-icon\"\n                  role=\"presentation\"\n                  aria-hidden=\"true\"\n                >\n                  <use href=\"/icons.svg#discord-icon\"></use>\n                </svg>\n                Discord\n              </a>\n            </li>\n            <li>\n              <a href=\"https://x.com/vite_js\" target=\"_blank\">\n                <svg\n                  className=\"button-icon\"\n                  role=\"presentation\"\n                  aria-hidden=\"true\"\n                >\n                  <use href=\"/icons.svg#x-icon\"></use>\n                </svg>\n                X.com\n              </a>\n            </li>\n            <li>\n              <a href=\"https://bsky.app/profile/vite.dev\" target=\"_blank\">\n                <svg\n                  className=\"button-icon\"\n                  role=\"presentation\"\n                  aria-hidden=\"true\"\n                >\n                  <use href=\"/icons.svg#bluesky-icon\"></use>\n                </svg>\n                Bluesky\n              </a>\n            </li>\n          </ul>\n        </div>\n      </section>\n\n      <div className=\"ticks\"></div>\n      <section id=\"spacer\"></section>\n    </>\n  )\n}\n\nexport default App\n" }]
    }

    example response:
    {
        "message": "File update results",
        "results": [
            {
                "/src/App.jsx": "File updated successfully"
            }
        ]
    }

4. Read Files: GET http://019ecfcf-4506-77ea-bd77-356fdcfc8b79.agent.localhost/read-file?files=src/App.css, src/App.jsx

    this api will take files names which you want to see the content of and return its content

    example response:
    {
        "message": "file contents",
        "files": [
            {
                "/src/App.css": ".counter {\n  font-size: 16px;\n  padding: 5px 10px;\n  border-radius: 5px;\n  color: var(--accent);\n  background: var(--accent-bg);\n  border: 2px solid transparent;\n  transition: border-color 0.3s;\n  margin-bottom: 24px;\n\n  &:hover {\n    border-color: var(--accent-border);\n  }\n  &:focus-visible {\n    outline: 2px solid var(--accent);\n    outline-offset: 2px;\n  }\n}\n\n.hero {\n  position: relative;\n\n  .base,\n  .framework,\n  .vite {\n    inset-inline: 0;\n    margin: 0 auto;\n  }\n\n  .base {\n    width: 170px;\n    position: relative;\n    z-index: 0;\n  }\n\n  .framework,\n  .vite {\n    position: absolute;\n  }\n\n  .framework {\n    z-index: 1;\n    top: 34px;\n    height: 28px;\n    transform: perspective(2000px) rotateZ(300deg) rotateX(44deg) rotateY(39deg)\n      scale(1.4);\n  }\n\n  .vite {\n    z-index: 0;\n    top: 107px;\n    height: 26px;\n    width: auto;\n    transform: perspective(2000px) rotateZ(300deg) rotateX(40deg) rotateY(39deg)\n      scale(0.8);\n  }\n}\n\n#center {\n  display: flex;\n  flex-direction: column;\n  gap: 25px;\n  place-content: center;\n  place-items: center;\n  flex-grow: 1;\n\n  @media (max-width: 1024px) {\n    padding: 32px 20px 24px;\n    gap: 18px;\n  }\n}\n\n#next-steps {\n  display: flex;\n  border-top: 1px solid var(--border);\n  text-align: left;\n\n  & > div {\n    flex: 1 1 0;\n    padding: 32px;\n    @media (max-width: 1024px) {\n      padding: 24px 20px;\n    }\n  }\n\n  .icon {\n    margin-bottom: 16px;\n    width: 22px;\n    height: 22px;\n  }\n\n  @media (max-width: 1024px) {\n    flex-direction: column;\n    text-align: center;\n  }\n}\n\n#docs {\n  border-right: 1px solid var(--border);\n\n  @media (max-width: 1024px) {\n    border-right: none;\n    border-bottom: 1px solid var(--border);\n  }\n}\n\n#next-steps ul {\n  list-style: none;\n  padding: 0;\n  display: flex;\n  gap: 8px;\n  margin: 32px 0 0;\n\n  .logo {\n    height: 18px;\n  }\n\n  a {\n    color: var(--text-h);\n    font-size: 16px;\n    border-radius: 6px;\n    background: var(--social-bg);\n    display: flex;\n    padding: 6px 12px;\n    align-items: center;\n    gap: 8px;\n    text-decoration: none;\n    transition: box-shadow 0.3s;\n\n    &:hover {\n      box-shadow: var(--shadow);\n    }\n    .button-icon {\n      height: 18px;\n      width: 18px;\n    }\n  }\n\n  @media (max-width: 1024px) {\n    margin-top: 20px;\n    flex-wrap: wrap;\n    justify-content: center;\n\n    li {\n      flex: 1 1 calc(50% - 8px);\n    }\n\n    a {\n      width: 100%;\n      justify-content: center;\n      box-sizing: border-box;\n    }\n  }\n}\n\n#spacer {\n  height: 88px;\n  border-top: 1px solid var(--border);\n  @media (max-width: 1024px) {\n    height: 48px;\n  }\n}\n\n.ticks {\n  position: relative;\n  width: 100%;\n\n  &::before,\n  &::after {\n    content: '';\n    position: absolute;\n    top: -4.5px;\n    border: 5px solid transparent;\n  }\n\n  &::before {\n    left: 0;\n    border-left-color: var(--border);\n  }\n  &::after {\n    right: 0;\n    border-right-color: var(--border);\n  }\n}\n"
            },
            {
                "/ src/App.jsx": "Eror reading file: ENOENT: no such file or directory, open '/workspace/ src/App.jsx'"
            }
        ]
    }

5. Invoke Agent: POST http://localhost/api/ai/agent/invoke

    this api will take your prompt and projectId(sandboxId) and make changes directly in the code according to your prompt like an AI agent

    example body:
    {
        "message": "add a snake game the controlls should be W for up A for left S for down and D for right. Think and take at least 2mins",
        "projectId": "019ecfcf-4506-77ea-bd77-356fdcfc8b79"
    }

    example streamed response:
    Files updated successfully.
    16:42:37.734
    (empty)
    16:42:37.175
    Updating files...
    16:42:37.147
    (empty)
    16:42:10.999
    Files read successfully.
    16:42:10.949
    (empty)
    16:42:09.140
    Reading files...
    16:42:09.122
    (empty)
    16:42:06.483
    Files listed successfully.
    16:42:06.456
    (empty)
    16:41:55.474
    Listing files in project directory...
    16:41:55.332
    Connected to http://localhost/api/ai/agent/invoke

6. Terminal: SocketIO http://019ecfcf-4506-77ea-bd77-356fdcfc8b79.agent.localhost

this socket io take a command in which is sent as the event 'terminal-output' and the frontend will listen for the event terminal output where there will be the output of the command

example conversation between server and frontend during socket io connection:
terminal-output
[?2004hroot@sandbox-pod-019ecfcf-4506-77ea-bd77-356fdcfc8b79:/workspace# [?2004l [?2004hroot@sandbox-pod-019ecfcf-4506-77ea-bd77-356fdcfc8b79:/workspace#
15:38:34.127
terminal-output
. .gitignore eslint.config.js package-lock.json src .. README.md index.html package.json vite.config.js .dockerignore dockerfile node_modules public
15:38:34.125
terminal-output
[?2004l
15:38:34.109
terminal-output
ls -a
15:38:34.021
terminal-input
ls -a
15:38:33.972
Listening to
terminal-output
15:34:58.236
Connected to http://019ecfcf-4506-77ea-bd77-356fdcfc8b79.agent.localhost
```

```