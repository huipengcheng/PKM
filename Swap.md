---
tags: 📝️/🌱️
publish: true
aliases: 
created: 2022-07-15 22-11
updated: 2022-07-15 22-11
---

# [[Swap]]

---

- Use `swapon --show` to show swap status 
- Use `free -h` to show physical memory as well as swap usage
- Two way to make swap:
	- Swap partition
	- Swap file: 
		- `dd if=/dev/zero of=/swapfile bs=1M count=512 status=progress`
		- `chmod 0600 /swapfile`
		- `mkswap -U clear /swapfile`
		- `swapon /swapfile`
		- Add `/swapfile none swap defaults 0 0` to `/etc/fstab`


---

- Topics: [[Linux]] [[Swap]]
	- 
- Reference: [Arch Wiki](https://wiki.archlinux.org/title/Swap)
	- 
- Related:
	- 
