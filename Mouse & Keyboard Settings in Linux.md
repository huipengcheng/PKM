---
tags: 📝️/🌱️
publish: true
aliases: 
created: 2022-07-16 17-34
updated: 2022-07-16 17-34
---

# [[Mouse & Keyboard Settings in Linux]]

---

### Kmonad
For now, I use [KMonad](https://github.com/kmonad/kmonad), which is cross-platform, to manage and customize my keyboard.

I grab the [kmonad.service](https://github.com/kmonad/kmonad/blob/master/startup/run) file and follow [systemd](https://wiki.archlinux.org/title/Systemd#Basic_systemctl_usage) to move this file to `/etc/systemd/system/` and execute `systemd enable kmonad.service` to start KMonad after system boot.

### Solaar
A third-party Logitech device GUI driver in linux, which installed by pacman and called `solaar-git`.

### Logiops
It is a more powerful Logitech device driver than [[#Solaar]], but unfortunately, it currently does not support Logi Bolt.

### Piper
GUI mouse config tool, it not support Logi Bolt yet.

---

- Topics: 
	- 
- Reference:
	- 
- Related:
	- 
