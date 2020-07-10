# NewCPProxy

A very *evil* Node.js TCP proxy for the CPPS called NewCP. This project should also work on other CPPS' with slight modification.

**Currently a work in progress.**

# What is it?

This is a proxy written for the flash game called Club Penguin, but specifically for NewCP. What it does is intercept incoming and outgoing data. During this process, we can modify data between the client and the server, allowing us to perform unexpected actions. For now, it's not quite sure what the possibilities are, as this has never been done before.

# Setup

- [Current Node.js](https://nodejs.org/en/download/current/)
- `127.0.0.1 newcp.net` in hosts (Open Notepad as **admin** and go to `C:\Windows\System32\drivers\etc\hosts`)
- `npm install` for dependencies
- `npm start login` to start the login proxy
- `npm start world` to start the world proxies
- Use [Play page](https://play.newcp.net/en/#/login)

# Testing

If you want to mess around with Club Penguin using this proxy, I recommend to use Windows Sandbox to test outcome on a different perspective when using 2 clients.

# Copyright

We all don't own Club Penguin, I'm not affiliated with any of the parties.
