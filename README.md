# HoudiniProxy

A very *evil* Node.js TCP proxy for Houdini CPPS'. The proxy should also work on other CPPS' with slight modification.

# What is it?

This is a proxy written for the flash game called Club Penguin, but specifically for Houdini CPPS'. What it does is intercept incoming and outgoing data. During this process, we can modify data between the client and the server, allowing us to perform unexpected actions.

# What can it do?

For now, I'm not quite sure what the possibilities are, as this has never been done before. This has to be researched.

# Information

This proxy is specifically in use for NewCP. They use some random shit cipher to 'encrypt' client=>server traffic. Also, NewCP uses the AS3 protocol. As I've said before, slight modification is needed to make this work on other CPPS'.

# Setup

- [Current Node.js](https://nodejs.org/en/download/current/)
- Edit `/config/index.js` to your target
- `127.0.0.1 newcp.net` (example) in hosts (Open Notepad as **admin** and go to `C:\Windows\System32\drivers\etc\hosts`)
- `npm install` for dependencies
- `npm start login` to start the login proxy
- `npm start world` to start the world proxies
- Use [Play page](https://play.newcp.net/en/#/login) (example)

# Copyright

We all don't own Club Penguin, neither do I.
