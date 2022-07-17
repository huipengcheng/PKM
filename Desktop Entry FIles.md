---
tags: 📝️/🌱️
publish: true
aliases: 
created: 2022-07-16 17-42
updated: 2022-07-16 17-42
---

# [[Desktop Entry FIles]]

---

Follow [this instruction](https://wiki.archlinux.org/title/Desktop_entries).

The example I made for [[#GoldenDict++]]. I set the `Exec` to `./goldendict.sh` before and this is wrong, the correct one is written below.

```shell
[Desktop Entry]
Type=Application
Name=GoldenDict++
Path=/home/chp/opt/GoldenDict++
Exec=zsh goldendict.sh
Icon=splash
Terminal=false
Categories=Education;Languages;
```
---

By now, [[#GoldenDict]] can be launched in GNOME application menu and by command `gtk-launch`, but in [[Awesome WM]], it can only be launched by command `gtk-launch`.

I install several packages, which are introduced in the instruction link, for operate desktop entries:
- `alacarte`: graphical editor
- `lsdesktopf`: list available `.desktop` files
- `fbrokendesktop`: detects broken `Exec` value in `.desktop` files

---

- Topics: 
	- [[Linux]]
	- [[Linux Setup]]
- Reference:
	- 
- Related:
	- 
