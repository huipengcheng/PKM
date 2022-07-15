---
tags: 📝️/🌱️
publish: true
aliases: 
created: 2022-07-14 11-29
updated: 2022-07-14 15-19
---

# [[Pacman Usage]]

---

### Basics
```shell
pacman -S
	# -yy means force a refresh for database
	# -cc means clean all cache
	# -uu means upgrade and downgrad packages
	# -q  means print download url
```

```shell
pacman -R <program>
	# -s for recursive
	# -c for cascade
	# -n means remove config files
	# -d means skip dependency version checks
```

```shell
pacman -Q
	# -d means list packages installed as dependencies
	# -t means list packages not (optionally) required by any package
	# -q for quiet
	# -e menas list packages explicitly installed
	# -i for information
```

### Tricks
- Remove packages
  ```shell
  sudo pacman -Rscnd <program>
  ```
- List explicitly installed packages
  ```shell
  sudo pacman -Qqet
  ```
- List 'orphan' packages
  ```shell
  sudo pacman -Qdtq
  ```
- Remove 'orphan' packages
  ```shell
  sudo pacman -Rsn $(pacman -Qdtq)
  ```
  


---

- Topics: 
	- [[Linux]] [[Arch]]
- Reference:
	- https://bbs.archlinux.org/viewtopic.php?pid=690438
- Related:
	- 
I