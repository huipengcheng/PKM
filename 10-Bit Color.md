---
tags: 📝️/🌱️
publish: true
aliases: 
created: 2022-07-16 17-37
updated: 2022-07-19 00-15
---

# [[10-Bit Color]]

---

### Enable

Follow this [instruction](https://wiki.archlinux.org/title/AMDGPU#10-bit_color).

If the monitor itself has already enabled 10-bit but not enabled 10-bit in system, it seems to cause some weird things, such as the improper rendering of scrolling in [[Awesome WM]].

### Compatibility

When 10-bit color is enabled, some applications may have some problems. See: [Compatibility](https://wiki.gentoo.org/wiki/30bpp#Compatibility).

For examples, JetBrains' IDEs ues Java AWT which will crash immediately on startup and throw a exception: `InvalidPipeException: Unsupported bit depth: 30`. I use the solution in the link above: add `-Dsun.java2d.opengl=true` to their start script.

---

- Topics: 
	- [[Linux]]
	- [[Linux Setup]]
- Reference:
	- [Xorg](https://wiki.archlinux.org/title/Xorg)
- Related:
	- 