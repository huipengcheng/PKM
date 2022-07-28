---
tags: 📝️/🌱️
publish: true
aliases: 
created: 2022-07-19 00-19
updated: 2022-07-19 13-44
---

# [[HiDPI]]

---

### Enable

In GNOME or KDE, we can use the system setting tool to adjust monitors' resolution, and the tool also provides a setting to scale displays, which can achieve HiDPI. 

But in other window environment, we don't have such a tool to set HiDPI. I found [this page](https://wiki.archlinux.org/title/HiDPI#Firefox) which illustrate how to set HiDPI using the **X Resources**.

### Compatibility 

Some Qt applications do not respect DPI setting, such as Okular, so that we need to manually instruct them to scale. We need to add the following lines to `/etc/environment`
```shell
export QT_AUTO_SCREEN_SCALE_FACTOR=1 # disable auto scale
export QT_SCALE_FACTOR=144 # as same as DPI
```

### Hi-res Scrolling

Scrolling in Linux is less smooth than Mac, so I did some Google and find [this page](https://rhtenhove.nl/blog/hires-scrolling-logitech/), which introduce a approach to achieve more smooth scrolling, called Hi-res scrolling, for Logitech mouse by [[#Solaar]].

Although Solaar is support my mouse (Lift), but there is currently no *Scroll Wheel Resolution* setting in Solaar for my mouse.

And then, I dig a little further through these pages: [1]([arch high resolution scroll](https://wiki.archlinux.org/title/HiDPI#Firefox)), [2](https://www.phoronix.com/scan.php?page=news_item&px=High-Res-Scrolling-Sep-2021), [3](https://flaviutamas.com/2020/understanding-linux-mouse-drivers), [4](https://who-t.blogspot.com/2021/08/libinput-and-high-resolution-wheel.html). Unfortunately, I still can not figure it out.

---

- Topics: 
	- [[Linux]]
	- [[Linux Setup]]
- Reference:
	- [HiDPI](https://wiki.archlinux.org/title/HiDPI#X_Server)
	- [Xorg](https://wiki.archlinux.org/title/Xorg)
- Related:
	- 
