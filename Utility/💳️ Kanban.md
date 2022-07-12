---
tags: ⚙️
aliases: 
cssclass: kanban_table
created: 2022-06-01 22-15
updated: 2022-06-01 22-15
---

---

| 🌱️           | 🌿️           | 🌞️           |
| ------------- | ------------- | ------------- |
| ![[#^cf60fd]] | ![[#^ef5588]] | ![[#^be3c0c]] |

---


```dataview
table tags, file.ctime.year as CY, file.ctime.month as CM, file.ctime.day as CD, file.mtime.year as MY, file.mtime.month as MM, file.mtime.day as MD
from ""
where tags = "📝️/🌱️"
sort file.ctime asc
```

^cf60fd

```dataview
table tags, file.ctime.year as CY, file.ctime.month as CM, file.ctime.day as CD, file.mtime.year as MY, file.mtime.month as MM, file.mtime.day as MD
from ""
where tags = "📝️/🌿️"
sort file.ctime asc
```

^ef5588

```dataview
table tags, file.ctime.year as CY, file.ctime.month as CM, file.ctime.day as CD, file.mtime.year as MY, file.mtime.month as MM, file.mtime.day as MD
from ""
where tags = "📝️/🌞️"
sort file.ctime asc
```

^be3c0c
