---
tags: 📝️/🌱️
publish: true
aliases: 
created: 2022-07-16 12-21
updated: 2022-07-16 22-18
---

# [[Linux Theme Customization]]

---

## [[GTK]]
I use `LXAppearance` to config theme both for GTK2 and GTK3 applications.

But `LXAppearance` can only change the theme of GTK applications, but can not customize the color scheme unless use LXSession as the session manager.

The GTK2 config file is loacated at `~/.gtkrc-2.0` and the GTK3 config file is located at `$XDG_CONFIG_HOME/gtk-3.0/setting.ini`.

## [[Qt]]

I use `qt5ct` to config theme for Qt5. The important part is adding `QT_QPA_PLATFORMTHEME=qt5ct` to `/etc/environment`. This makes the Qt theme redirect to `qt5ct`.

## Uniform look for Qt and GTK applications
- Choose the same theme that both Qt and GTK have
	- Breeze
	- Adwaita
- Theme engines, which translate themes between one or more toolkits.
	- Kvantum
		- Kvantum provides some themes which are in GTK, such as Arc
		- Set Qt theme to kvantum in qt5ct, and modify theme in kvantummanager.
	- QGtkStyle (located into qt5-styleplugins)

I found that set theme to gtk2 in `qt5ct` also can make Qt application's theme uniform with GTK applications'.

## Auto dark 
[darkman](https://gitlab.com/WhyNotHugo/darkman/)

---

- Topics: 
	- [[Linux]] [[GTK]] [[Qt]]
- Reference:
	- [GTK](https://wiki.archlinux.org/title/GTK#Configuration_tools)
	- [Qt](https://wiki.archlinux.org/title/Qt)
	- [Uniform look for Qt and GTK applications](https://wiki.archlinux.org/title/GTK#Configuration_tools)
	- [Dark Mode switching](https://wiki.archlinux.org/title/Dark_mode_switching)
- Related:
	- 