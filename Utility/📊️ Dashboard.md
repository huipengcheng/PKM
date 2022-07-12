---
tags: ⚙️
aliases: dashboard
cssclass: 
created: 2022-06-01 22-15
updated: 2022-06-01 22-15
---

# Table Of Contents

---


---

## Tasks

---

```dataviewjs
// find dates based on format [[YYYY-MM-DD]]
const findDated = (task)=>{
 if( !task.completed ) {
  task.link = " " + "[[" + task.path + "|*]]";  
  task.date="";
  const found = task.text.match(/\[\[([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))\]\]/);
  if(found) task.date = moment(found[1]);
  return true;  
 }
}
const myTasks =  dv.pages("").file.tasks.where(t => findDated(t));
dv.header(3,"Overdue");
dv.table(["task","link"], myTasks.filter(t=> moment(t.date).isBefore(moment(),"day")).sort(t=>t.date).map(t=>[t.text, t.link]));
dv.header(3,"Today");
dv.table(["task","link"], myTasks.filter(t=> moment(t.date).isSame(moment(),"day")).sort(t=>t.date).map(t=>[t.text, t.link]));
dv.header(3,"Upcoming");
dv.table(["task","link"], myTasks.filter(t=> moment(t.date).isAfter(moment(),"day")).sort(t=>t.date).map(t=>[t.text, t.link]));
dv.header(3,"Undated");
dv.table(["task","link"], myTasks.filter(t=> !t.date).sort(t=>t.text).map(t=>[t.text, t.link]));
```

---

## On This Day

---

```dataviewjs
let dates = {
  today: new Date(),
  activeFile: new Date(app.workspace.getActiveFile().name.substring(0, 10)),
};

let dateToCompare = dates.today;
let openFileDateFormatted = formatDate(dates.activeFile);
let pages = dv.pages('"Journal/Daily"').where(onThisDay);
let columns = ["File"];

function render() {
  dates.activeFile = new Date(
    app.workspace.getActiveFile().name.substring(0, 10)
  );

  if (isNaN(dates.activeFile)) {
    dateToCompare = dates.today;
  } else {
    dateToCompare = dates.activeFile;
  }

  pages = dv.pages('"Journal/Daily"').where(onThisDay);

  dv.container.empty();

  dv.header(2, "On this day");
  dv.list(pages.file.link);
}

render();
app.workspace.on("file-open", function cb() {
  render();
});

function pad(n, width, z) {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function formatDataviewDate(dateObject) {
  let month = pad(dateObject.file.day.month, 2);
  let day = pad(dateObject.file.day.day, 2);

  return `-${month}-${day}`;
}

function formatDate(date) {
  let month = pad(date.getMonth() + 1, 2);
  let day = pad(date.getDate(), 2);
  return `-${month}-${day}`;
}

function onThisDay(dailyNote) {
  return formatDataviewDate(dailyNote) == formatDate(dateToCompare);
}
```
