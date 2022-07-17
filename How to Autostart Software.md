---
tags: 📝️/🌱️
publish: true
aliases: 
created: 2022-07-16 17-27
updated: 2022-07-16 17-27
---

# [[How to Autostart Software]]

---

There are a lot ways of [autostarting](https://wiki.archlinux.org/title/Autostarting).

I put almost everything that needed to be autostarting to `~/.xprofile`, which is the `xorg` way, (for what is needed to start at the very beginning, such as [[Linux Setup#Kmonad]], I use the `systemd` way), and the autostarting procedure should be like:
- With a display managers
	- Display managers source `~/.xprofile` before the window manager is started.
- Without a display managers, which means the `default.target` is set to `multi-user.target` (Follow [this](https://wiki.archlinux.org/title/Xinit#Autostart_X_at_login))
	- I write some scripts in `~/.zprofile` (cause `zsh` is my default shell):
	  ```shell
	  if [ -z "${DISPLAY}" ] && [[ "$(tty)" = "/dev/tty1" ]] then;
	      pgrep awesome || startx "~/.xinitrc"
	  fi
	  ```
		- The variable `DISPLAY` is set to `:0` when using `graphcal.default` and unset when using `multi-user.default`.
	- When I log in, `zsh` will execute `~/.zprofile` which will execute `startx`.
	- `startx` will execute `~/.xinitrc` and I make `~/.xinitrc` to source `~/.xprofile` and launch [[Awesome WM]].
	- But when log out and want to log in again, we may need manually execute `~/.zprofile`.

---

- Topics: 
	- [[Linux]]
	- [[Linux Setup]]
- Reference: 
	- [Autostarting](https://wiki.archlinux.org/title/Autostarting)
	- [Autostart_X_at_login](https://wiki.archlinux.org/title/Xinit#Autostart_X_at_login)
- Related:
	- 
