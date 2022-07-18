---
tags: 📝️/🌱️
publish: true
aliases: 
created: 2022-07-16 17-37
updated: 2022-07-18 00-11
---

# [[Linux Display Settings]]

---

### HiDPI
In GNOME or KDE, we can use the system setting tool to adjust monitors' resolution, and the tool also provides a setting to scale displays, which can achieve HiDPI. 

But in other window environment, we don't have such a tool to set HiDPI. I found [this page](https://wiki.archlinux.org/title/HiDPI#Firefox) which illustrate how to set HiDPI using the **X Resources**.

### Enable 10-Bit Color

Follow this [instruction](https://wiki.archlinux.org/title/AMDGPU#10-bit_color).

If the monitor itself has already enabled 10-bit but not enabled 10-bit in system, it seems to cause some weird things, such as the improper rendering of scrolling in [[Awesome WM]].

#### Comapability

When [[#Enable 10-Bit Color|30-bit depth]] is enabled, some applications may have some problems. See: [Compatibility](https://wiki.gentoo.org/wiki/30bpp#Compatibility).

For examples, JetBrains' IDEs ues Java AWT which will crash immediately on startup and throw a exception: `InvalidPipeException: Unsupported bit depth: 30`. I use the solution in the link above: add `-Dsun.java2d.opengl=true` to their start script.

### Hi-res Scrolling
Scrolling in Linux is less smoother than Mac, so I did some Google and find [this page](https://rhtenhove.nl/blog/hires-scrolling-logitech/), which introduce a approach to achieve more smoother scrolling, called Hi-res scrolling, for Logitech mouse by [[#Solaar]].

Although Solaar is support my mouse (Lift), but there is currently no *Scroll Wheel Resolution* setting in Solaar for my mouse.

And then, I dig a little further through these pages: [1](arch high resolution scroll), [2](https://www.phoronix.com/scan.php?page=news_item&px=High-Res-Scrolling-Sep-2021), [3](https://flaviutamas.com/2020/understanding-linux-mouse-drivers), [4](https://who-t.blogspot.com/2021/08/libinput-and-high-resolution-wheel.html). Unfortunately, I still can not figure it out.

---

- Topics: 
	- [[Linux]]
	- [[Linux Setup]]
- Reference:
	- [Xorg](https://wiki.archlinux.org/title/Xorg)
	- [HiDPI](https://wiki.archlinux.org/title/HiDPI#X_Server)
- Related:
	- 
