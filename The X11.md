---
tags: 📝️/🌱️
publish: true
aliases: 
created: 2022-07-16 17-44
updated: 2022-07-16 17-44
---

# [[The X11]]

---

### .xinitrc 
The [`xinit`](https://wiki.archlinux.org/title/Xinit) program allows a user to **manually** start an Xorg display server. The `startx` script is a front-end for `xinit`.

### .xProfile
An [xprofile](https://wiki.archlinux.org/title/Xprofile) file, `~/.xprofile` and `/etc/xprofile`, allows you to execute commands at the beginning of the X user session - before the window manager is started.

### .Xresources
It will be loaded by the default [[#.xinitrc]] file and most [[#Display Managers]]. 

### Startup procedures
We can boot into our systems through multi-users.target or graphical.target:
- When we’ve logged into shell (multi-users.target), we need to run [[xinit]] or `startx` (a wrapper script of xinit) if we want to start a GUI session. The `xinit` does the following things in order:
	- Start an X server (typically through the script `/etc/X11/xinit/xserverrc`).
	- Usually run some scripts in `/etc/X11` (typically `/etc/X11/xinit/xinitrc`), depending on how it's set up.
	- Run `~/.xinitrc`, if it exists. If it doesn't exist, run a default client (traditionally `xterm`).
	- Once `~/.xinitrc` terminates, kill the X server.
- If you log in in graphical mode on a [[Display Manager]], traditionally, what is executed after you log in is some scripts in `/etc/X11` then `~/.xsession`.
	- `~/.xsession` has the role of `~/.profile` and `~/.xinitrc` combined: it's supposed to perform the initial startup of your session (e.g. define environment variables), then launch programs specific to the GUI (usually at least window manager).
	
### XSession 
Many display managers read available sessions from `/usr/share/xsessions/` directory. It contains standard [[Desktop Entry FIles|desktop entry files]] for each desktop environment or window manager. Then, display managers display give you a choice of a session. Choosing a particular session launched a specific desktop environment, session manager, window manager. What is executed then is only that DE/SM/WM and whatever programs it chooses to start based on whatever configuration files it chooses to read. Many environments provide a “custom session” that reads the traditional `~/.xsession`.

### [[Display Managers]]
A [display manager](https://wiki.archlinux.org/title/Display_manager), or login manager, is typically a graphical user interface that is displayed at the end of the boot process in place of the default shell.

There are two kinds of display managers: 
- Console
	- ly (installed)
- Graphical
	- LightDM
	- SDDM
	- GDM (installed, default for GNOME)

If we want to change the current display manager:
- Firstly make the `default.target` to `graphcial.target`, whether the display manager is console or graphical. The command we should execute is: `systemctl set-default graphcal.target`.
- Then, we install the display manager we want and **enable** it's systemd service which located in `/usr/lib/systemd/system/`.
- Then, we should make a soft link, which link from the service mentioned above to `etc/systemd/system/display-manager.service` (may need `--force` to override the old symlink).

Most display managers source `/etc/xprofile`, `~/.xprofile`, `/etc/X11/xinit/xinitrc.d/`, `~/.Xresources` on startup (Note there is no **~/.xinitrc**).


---

- Topics: 
	- [[Linux]]
	- [[Linux Setup]]
- Reference:
	- [xinit](https://wiki.archlinux.org/title/Xinit)
	- [xprofile](https://wiki.archlinux.org/title/Xprofile)
	- [What is ".xsession" for](https://unix.stackexchange.com/a/47426)
	- [Session configuration](https://wiki.archlinux.org/title/Display_manager#Session_configuration)
- Related:
	- 
