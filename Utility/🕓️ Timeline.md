---
tags: ⚙️
aliases: 
cssclass:
created: 2022-05-04 2314
updated: 2022-05-04 2320
---

```dataview
list 
from "" AND !"Journal" AND !"Templates"
where file.day = null AND type != null
sort file.day desc
```

---



```dataview
list
from "" AND !"Journal"
where type != null AND file.day
sort file.day desc
```
