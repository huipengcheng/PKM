---
tags: 📝️/🌱️
publish: true
aliases: 
created: 2022-07-03 20-36
updated: 2022-07-19 00-24
---

# [[Mac Software Setup]]
---
### Clash For Window
CFW (Clash for Windows) is a VPN, but I do not use it as system proxy. It's just running in the background.

### Proxifier
Proxifier is a software acting like a manual system proxy, it is used to set proxy manually for apps or hosts.
I've set several rules:
- CFW (preventing loop) -> Direct
- GlobalHost (which control all system traffic respecting to their target hosts) -> Direct
- FireFox (set proxy in FireFox interally) -> Direct
- Some App (like WeChat, QQ, etc) -> Direct
- Some cracked App -> Block
- Mail (just QQ Mail) -> Direct
- Default (all the traffic escaping from the above rules) -> Send to CFW

The mind behind CFW and Proxifier is: use CFW running in the background and do not let CFW control the system traffic, but use Proxifier to manually redirect the requests of apps and hosts to or not to CFW.

---

- Topics: 
	- [[Mac]]
- Reference:
	- 
- Related:
	- 
