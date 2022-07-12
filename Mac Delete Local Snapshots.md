---
tags: 📝️/🌱️
publish: true
aliases: 
created: 2022-06-11 15-31
updated: 2022-06-12 18-38
---

# [[Mac Delete Local Snapshots]]

---

```shell
tmutil listlocalsnapshots / \
  | cut -d. -f4 \
  | xargs -n1 tmutil deletelocalsnapshots
```

---

- Topics: 
	- [[Mac]]
- Reference:
	- 
- Related:
	- 
