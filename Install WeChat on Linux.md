---
tags: 📝️/🌱️
publish: true
aliases: 
created: 2022-07-16 17-31
updated: 2022-07-16 17-31
---

# [[Install WeChat on Linux]]

---

I install WeChat on [[Arch]] and the procedure is listed below:
1. Add `archlinuxcn` to `pacman.conf`
2. Install `wine-wechat-setup` using pacman. This package adds some support to Chinese characters in case of malfunctional redenring of Chinese characters. 
3. The step 2 will additionally install `wine-gecko` which will produce a noticeable black shade around WeChat when it's installed. So, install `wine-for-wechat` to supersede `wine-gecko`.   
4. Download WeChat Windows installer from its official site.
5. Use command `wine` to install WeChat.
6. `wine-wechat-setup` will also install a CLI tool named `wechat` which can open and set config of WeChat.

---

- Topics: 
	- [[Linux]]
	- [[Linux Setup]]
- Reference:
	- 
- Related:
	- 
