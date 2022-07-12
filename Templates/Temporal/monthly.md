---
tags:
publish: false
aliases: 
---

# Monthly Review:
%% This template Requires the Templateddr plugin %%
[[<% tp.date.now("YYYY-[M]MM", "P-1M") %>]] <== This Month ==> [[<% tp.date.now("YYYY-[M]MM", "P+1M") %>]]

---

- [[<% tp.date.weekday("YYYY-[W]ww", 0, tp.file.title, "YYYY-[M]MM") %>]]
- [[<% tp.date.weekday("YYYY-[W]ww", 7, tp.file.title, "YYYY-[M]MM") %>]]
- [[<% tp.date.weekday("YYYY-[W]ww", 14, tp.file.title, "YYYY-[M]MM") %>]]
- [[<% tp.date.weekday("YYYY-[W]ww", 21, tp.file.title, "YYYY-[M]MM") %>]]
- [[<% tp.date.weekday("YYYY-[W]ww", 28, tp.file.title, "YYYY-[M]MM") %>]]

