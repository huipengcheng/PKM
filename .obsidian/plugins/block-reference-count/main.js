/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/main.ts
__export(exports, {
  default: () => BlockRefCounter
});
var import_obsidian5 = __toModule(require("obsidian"));

// src/indexer.ts
var import_obsidian = __toModule(require("obsidian"));
var references;
function buildLinksAndReferences(app) {
  const refs = app.fileManager.getAllLinkResolutions().reduce((acc, link) => {
    let key = link.reference.link;
    if (key.includes("/")) {
      const keyArr = key.split("/");
      key = keyArr[keyArr.length - 1];
    }
    if (!acc[key]) {
      acc[key] = [];
    }
    if (acc[key]) {
      acc[key].push(link);
    }
    return acc;
  }, {});
  const allLinks = Object.entries(app.metadataCache.getLinks()).reduce((acc, [key, links]) => {
    links.forEach((link) => {
      if (link.original.startsWith("[[#") || link.original.startsWith("![[#")) {
        const newLink = {
          reference: {
            link: link.link,
            displayText: link.link,
            position: link.position
          },
          resolvedFile: app.vault.getAbstractFileByPath(key),
          resolvedPaths: [link.link],
          sourceFile: app.vault.getAbstractFileByPath(key)
        };
        acc.push(newLink);
      }
    });
    return acc;
  }, []);
  allLinks.forEach((link) => {
    if (link.sourceFile) {
      const key = `${link.sourceFile.basename}${link.reference.link}`;
      if (!refs[key]) {
        refs[key] = [];
      }
      if (refs[key]) {
        refs[key].push(link);
      }
    }
  });
  references = refs;
}
function getCurrentPage({
  file,
  app
}) {
  const cache = app.metadataCache.getFileCache(file);
  if (!references) {
    buildLinksAndReferences(app);
  }
  const headings = Object.values(app.metadataCache.metadataCache).reduce((acc, file2) => {
    const headings2 = file2.headings;
    if (headings2) {
      headings2.forEach((heading) => {
        acc.push(heading.heading);
      });
    }
    return acc;
  }, []);
  const transformedCache = {};
  if (cache.blocks) {
    transformedCache.blocks = Object.values(cache.blocks).map((block) => ({
      key: block.id,
      pos: block.position,
      page: file.basename,
      type: "block",
      references: references[`${file.basename}#^${block.id}`] || []
    }));
  }
  if (cache.headings) {
    transformedCache.headings = cache.headings.map((header) => ({
      original: header.heading,
      key: (0, import_obsidian.stripHeading)(header.heading),
      pos: header.position,
      page: file.basename,
      type: "header",
      references: references[`${file.basename}#${(0, import_obsidian.stripHeading)(header.heading)}`] || []
    }));
  }
  if (cache.sections) {
    transformedCache.sections = createListSections(cache);
  }
  if (cache.links) {
    transformedCache.links = cache.links.map((link) => {
      if (link.link.includes("/")) {
        const keyArr = link.link.split("/");
        link.link = keyArr[keyArr.length - 1];
      }
      return {
        key: link.link,
        type: "link",
        pos: link.position,
        page: file.basename,
        references: references[link.link] || []
      };
    });
    if (transformedCache.links) {
      transformedCache.links = transformedCache.links.map((link) => {
        if (link.key.includes("/")) {
          const keyArr = link.key.split("/");
          link.key = keyArr[keyArr.length - 1];
        }
        if (link.key.includes("#") && !link.key.includes("#^")) {
          const heading = headings.filter((heading2) => (0, import_obsidian.stripHeading)(heading2) === link.key.split("#")[1])[0];
          link.original = heading ? heading : void 0;
        }
        if (link.key.startsWith("#^") || link.key.startsWith("#")) {
          link.key = `${link.page}${link.key}`;
          link.references = references[link.key] || [];
        }
        return link;
      });
    }
  }
  if (cache.embeds) {
    transformedCache.embeds = cache.embeds.map((embed) => {
      if (embed.link.includes("/")) {
        const keyArr = embed.link.split("/");
        embed.link = keyArr[keyArr.length - 1];
      }
      return {
        key: embed.link,
        page: file.basename,
        type: "link",
        pos: embed.position,
        references: references[embed.link] || []
      };
    });
    if (transformedCache.embeds) {
      transformedCache.embeds = transformedCache.embeds.map((embed) => {
        if (embed.key.includes("#") && !embed.key.includes("#^") && transformedCache.headings) {
          const heading = headings.filter((heading2) => heading2.includes(embed.key.split("#")[1]))[0];
          embed.original = heading ? heading : void 0;
        }
        if (embed.key.startsWith("#^") || embed.key.startsWith("#")) {
          embed.key = `${file.basename}${embed.key}`;
          embed.references = references[embed.key] || [];
        }
        return embed;
      });
    }
  }
  return transformedCache;
}
function createListSections(cache) {
  if (cache.listItems) {
    return cache.sections.map((section) => {
      const items = [];
      if (section.type === "list") {
        cache.listItems.forEach((item) => {
          var _a, _b, _c, _d;
          if (item.position.start.line >= section.position.start.line && item.position.start.line <= section.position.end.line) {
            const id = ((_b = (_a = cache.embeds) == null ? void 0 : _a.find((embed) => embed.position.start.line === item.position.start.line)) == null ? void 0 : _b.link) || ((_d = (_c = cache.links) == null ? void 0 : _c.find((link) => link.position.start.line === item.position.start.line)) == null ? void 0 : _d.link) || "";
            items.push(__spreadValues({ key: id, pos: item.position }, item));
          }
        });
        const sectionWithItems = __spreadValues({ items }, section);
        return sectionWithItems;
      }
      return section;
    });
  }
  return cache.sections;
}

// src/settings.ts
var import_obsidian2 = __toModule(require("obsidian"));
var DEFAULT_SETTINGS = {
  displayParent: true,
  displayChild: true,
  displayBlocks: true,
  displayHeadings: true,
  displayLinks: true,
  displayEmbeds: true,
  indexOnVaultOpen: true,
  indexOnFileOpen: true,
  indexOnFileChange: true,
  indexOnLayoutChange: true,
  tableType: "search"
};
var settings = __spreadValues({}, DEFAULT_SETTINGS);
var getSettings = () => {
  return __spreadValues({}, settings);
};
var updateSettings = (newSettings) => {
  settings = __spreadValues(__spreadValues({}, settings), newSettings);
  return getSettings();
};
var BlockRefCountSettingTab = class extends import_obsidian2.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", {
      text: "Block Reference Counter Settings"
    });
    containerEl.createEl("h3", {
      text: "What elements should references be displayed on?"
    });
    new import_obsidian2.Setting(containerEl).setName("Display on Parents").setDesc("Display the count of block references on the parent block or header").addToggle((toggle) => {
      toggle.setValue(getSettings().displayParent);
      toggle.onChange((val) => __async(this, null, function* () {
        updateSettings({ displayParent: val });
        yield this.plugin.saveSettings();
      }));
    });
    new import_obsidian2.Setting(containerEl).setName("Display on Children").setDesc("Display the count of block references on the child reference blocks").addToggle((toggle) => {
      toggle.setValue(getSettings().displayChild);
      toggle.onChange((val) => __async(this, null, function* () {
        updateSettings({ displayChild: val });
        yield this.plugin.saveSettings();
      }));
    });
    new import_obsidian2.Setting(containerEl).setName("Display on Blocks").setDesc("Display the count of block references on blocks").addToggle((toggle) => {
      toggle.setValue(getSettings().displayBlocks);
      toggle.onChange((val) => __async(this, null, function* () {
        updateSettings({ displayBlocks: val });
        yield this.plugin.saveSettings();
      }));
    });
    new import_obsidian2.Setting(containerEl).setName("Display on Headers").setDesc("Display the count of block references on headers").addToggle((toggle) => {
      toggle.setValue(getSettings().displayHeadings);
      toggle.onChange((val) => __async(this, null, function* () {
        updateSettings({ displayHeadings: val });
        yield this.plugin.saveSettings();
      }));
    });
    new import_obsidian2.Setting(containerEl).setName("Display on Links").setDesc("Display the count of block references on links").addToggle((toggle) => {
      toggle.setValue(getSettings().displayLinks);
      toggle.onChange((val) => __async(this, null, function* () {
        updateSettings({ displayLinks: val });
        yield this.plugin.saveSettings();
      }));
    });
    new import_obsidian2.Setting(containerEl).setName("Display on Embeds").setDesc("Display the count of block references on Embeds").addToggle((toggle) => {
      toggle.setValue(getSettings().displayEmbeds);
      toggle.onChange((val) => __async(this, null, function* () {
        updateSettings({ displayEmbeds: val });
        yield this.plugin.saveSettings();
      }));
    });
    containerEl.createEl("h3", {
      text: "When should new references be indexed?"
    });
    containerEl.createEl("p", {
      text: "If you are experieincing lag, try toggling these settings off. Reload your vault for these settings to apply"
    });
    new import_obsidian2.Setting(containerEl).setName("File Open").setDesc("Index new references when the file is opened").addToggle((toggle) => {
      toggle.setValue(getSettings().indexOnFileOpen);
      toggle.onChange((val) => __async(this, null, function* () {
        updateSettings({ indexOnFileOpen: val });
        yield this.plugin.saveSettings();
      }));
    });
    new import_obsidian2.Setting(containerEl).setName("File Edited").setDesc("Index new references when the file is edited").addToggle((toggle) => {
      toggle.setValue(getSettings().indexOnFileChange);
      toggle.onChange((val) => __async(this, null, function* () {
        updateSettings({ indexOnFileChange: val });
        yield this.plugin.saveSettings();
      }));
    });
    new import_obsidian2.Setting(containerEl).setName("Layout Changed").setDesc("Index new references when the layout is changed").addToggle((toggle) => {
      toggle.setValue(getSettings().indexOnLayoutChange);
      toggle.onChange((val) => __async(this, null, function* () {
        updateSettings({ indexOnLayoutChange: val });
        yield this.plugin.saveSettings();
      }));
    });
    new import_obsidian2.Setting(containerEl).setName("Type of Reference Table").setDesc("Choose what type of table you'd like references displayed as.").addDropdown((dropdown) => {
      const { tableType } = getSettings();
      dropdown.addOption("search", "Search Results Table");
      dropdown.addOption("basic", "Basic Table");
      dropdown.setValue(tableType);
      dropdown.onChange((val) => __async(this, null, function* () {
        updateSettings({ tableType: val });
        yield this.plugin.saveSettings();
      }));
    });
  }
};

// src/process.ts
var import_obsidian4 = __toModule(require("obsidian"));

// src/view.ts
var import_obsidian3 = __toModule(require("obsidian"));
function createButtonElements(app, buttons2) {
  buttons2.forEach(({ block, val }) => {
    const count = block && block.references ? block.references.length : 0;
    const existingButton = val.querySelector("[data-count=count]");
    const countEl = createCounter(block, count);
    if (val) {
      const { tableType } = getSettings();
      if (tableType === "basic") {
        countEl.on("click", "button", () => {
          createRefTableElement(app, block, val);
        });
      }
      if (tableType === "search") {
        countEl.on("click", "button", () => {
          createSearchElement(app, block, val);
        });
      }
      if (existingButton) {
        existingButton.remove();
      }
      count > 0 && val.prepend(countEl);
    }
  });
}
function createCounter(block, count) {
  const countEl = createEl("button", { cls: "block-ref-count" });
  countEl.setAttribute("data-block-ref-id", block.key);
  countEl.setAttribute("data-count", "count");
  if (block.type === "link" || block.type === "list") {
    countEl.addClass("child-ref");
  } else {
    countEl.addClass("parent-ref");
  }
  countEl.innerText = count.toString();
  return countEl;
}
function createRefTableElement(app, block, val) {
  const refs = block.references ? block.references : void 0;
  const refTable = createTable(app, refs);
  if (!val.children.namedItem("ref-table")) {
    block.type === "block" && val.appendChild(refTable);
    block.type === "header" && val.appendChild(refTable);
    block.type === "link" && val.append(refTable);
    block.type.includes("list") && val.insertBefore(refTable, val.children[2]);
  } else {
    if (val.children.namedItem("ref-table")) {
      val.removeChild(refTable);
    }
  }
}
function buildSearchQuery(block) {
  let page;
  let firstReference;
  let secondReference;
  if (block.type === "link" || block.type === "link-list") {
    if (block.key.includes("/")) {
      const keyArr = block.key.split("/");
      block.key = keyArr[keyArr.length - 1];
    }
    page = block.key;
    if (block.key.includes("#") && !block.key.includes("#^")) {
      page = block.key.split("#")[0];
      if (block.original) {
        firstReference = `/^#{1,6} ${regexEscape(block.original)}$/`;
      } else {
        firstReference = `/^#{1,6} ${regexEscape(block.key.split("#")[1])}/`;
      }
      secondReference = `/#${block.key.split("#")[1]}]]/`;
    }
    if (block.key.includes("#^")) {
      page = block.key.split("#^")[0];
      firstReference = `"^${block.key.split("#^")[1]}"`;
      if (block.key.includes("|")) {
        firstReference = `${firstReference.split("|")[0]}"`;
      }
      secondReference = `"#^${block.key.split("#^")[1]}"`;
    }
    if (!firstReference) {
      firstReference = "";
      secondReference = `"[[${block.key}]]"`;
    }
    if (block.key.includes("|")) {
      secondReference = secondReference + ` OR "${block.key.split("|")[0]}]]"`;
    } else {
      secondReference = secondReference + ` OR "[[${block.key}|"`;
    }
  }
  if (block.type === "header") {
    page = block.page;
    firstReference = `/^#{1,6} ${regexEscape(block.original)}$/`;
    secondReference = `/#${block.key}]]/`;
  }
  if (block.type === "block" || block.type === "block-list") {
    page = block.page;
    firstReference = `"^${block.key}"`;
    secondReference = `"${block.page}#^${block.key}"`;
  }
  return `(file:("${page}.md") ${firstReference}) OR (${secondReference}) `;
}
function createSearchElement(app, block, val) {
  return __async(this, null, function* () {
    const normalizedKey = normalize(block.key);
    const searchEnabled = app.internalPlugins.getPluginById("global-search").enabled;
    if (!searchEnabled) {
      new import_obsidian3.Notice("you need to enable the core search plugin");
    } else {
      const tempLeaf = app.workspace.getRightLeaf(false);
      tempLeaf.tabHeaderEl.hide();
      yield tempLeaf.setViewState({
        type: "search-ref",
        state: {
          query: buildSearchQuery(block)
        }
      });
      const search = app.workspace.getLeavesOfType("search-ref");
      const searchElement = createSearch(search, block);
      const searchHeight = 300;
      searchElement.setAttribute("style", "height: " + searchHeight + "px;");
      if (!val.children.namedItem("search-ref")) {
        search[search.length - 1].view.searchQuery;
        block.type === "block" && val.appendChild(searchElement);
        block.type === "header" && val.appendChild(searchElement);
        block.type === "link" && val.append(searchElement);
        block.type.includes("list") && val.insertBefore(searchElement, val.children[2]);
      } else {
        if (val.children.namedItem("search-ref")) {
          app.workspace.getLeavesOfType("search-ref").forEach((leaf) => {
            const container = leaf.view.containerEl;
            const dataKey = `[data-block-ref-id='${normalizedKey}']`;
            const key = container.parentElement.querySelector(dataKey);
            if (key) {
              leaf.detach();
            }
          });
        }
      }
    }
  });
}
function createSearch(search, block) {
  const searchElement = search[search.length - 1].view.containerEl;
  const normalizedKey = normalize(block.key);
  searchElement.setAttribute("data-block-ref-id", normalizedKey);
  searchElement.setAttribute("id", "search-ref");
  return searchElement;
}
function createTable(app, refs) {
  const refTable = createEl("table", { cls: "ref-table" });
  refTable.setAttribute("id", "ref-table");
  const noteHeaderRow = createEl("tr").createEl("th", { text: "Note" });
  const lineHeaderRow = createEl("tr").createEl("th", {
    text: "Reference",
    cls: "reference"
  });
  refTable.appendChild(noteHeaderRow);
  refTable.appendChild(lineHeaderRow);
  refs && refs.forEach((ref) => __async(this, null, function* () {
    const lineContent = yield app.vault.cachedRead(ref.sourceFile).then((content) => content.split("\n")[ref.reference.position.start.line]);
    const row = createEl("tr");
    const noteCell = createEl("td");
    const lineCell = createEl("td");
    noteCell.createEl("a", {
      cls: "internal-link",
      href: ref.sourceFile.path,
      text: ref.sourceFile.basename
    });
    lineCell.createEl("span", { text: lineContent });
    row.appendChild(noteCell);
    row.appendChild(lineCell);
    refTable.appendChild(row);
  }));
  return refTable;
}
function regexEscape(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var normalize = (str) => {
  return str.replace(/\s+|'/g, "").toLowerCase();
};

// src/process.ts
function createPreviewView(plugin) {
  var _a;
  const buttons2 = [];
  const app = plugin.app;
  const activeView = app.workspace.getActiveViewOfType(import_obsidian4.MarkdownView);
  if (activeView) {
    const page = getCurrentPage({ file: activeView.file, app });
    try {
      (_a = activeView.previewMode) == null ? void 0 : _a.renderer.onRendered(() => {
        var _a2, _b;
        const elements = (_b = (_a2 = activeView.previewMode) == null ? void 0 : _a2.renderer) == null ? void 0 : _b.sections;
        if (page && elements) {
          elements.forEach((section) => {
            const processed = processPage(page, app, section.el, section.lineStart);
            if (processed.length > 0) {
              buttons2.push(...processed);
            }
          });
        }
      });
      const el = document.createElement("div");
      const cache = plugin.app.metadataCache.getFileCache(activeView.file);
      if (cache) {
        const { sections } = cache;
        if (sections) {
          sections.forEach((section) => {
            const processed = processPage(page, app, el, section.position.start.line);
            if (processed.length > 0) {
              buttons2.push(...processed);
            }
          });
        }
      }
      return buttons2;
    } catch (e) {
      console.log(e);
    }
  }
}
function processPage(page, app, el, start) {
  const buttons2 = [];
  const settings2 = getSettings();
  if (page.sections) {
    page.sections.forEach((pageSection) => {
      if (pageSection.position.start.line === start) {
        pageSection.pos = pageSection.position.start.line;
        const type = pageSection == null ? void 0 : pageSection.type;
        const embeds = el.querySelectorAll(".internal-embed");
        const hasEmbed = embeds.length > 0 ? true : false;
        if (settings2.displayParent && settings2.displayBlocks && page.blocks && !hasEmbed && (type === "paragraph" || type === "list" || type === "blockquote" || type === "code")) {
          const blockButtons = addBlockReferences(el, page.blocks, pageSection);
          buttons2.push(...blockButtons);
        }
        if (settings2.displayParent && settings2.displayHeadings && page.headings && type === "heading") {
          const headerButtons = addHeaderReferences(el, page.headings, pageSection);
          buttons2.push(...headerButtons);
        }
        if (settings2.displayChild && settings2.displayLinks && page.links) {
          const linkButtons = addLinkReferences(el, page.links, pageSection);
          buttons2.push(...linkButtons);
        }
        if (settings2.displayChild && settings2.displayEmbeds && page.embeds) {
          const embedButtons = addEmbedReferences(el, page.embeds, pageSection);
          buttons2.push(...embedButtons);
        }
      }
    });
    if (buttons2.length > 0) {
      createButtonElements(app, buttons2);
    }
    return buttons2;
  }
}
function addBlockReferences(val, blocks, section) {
  const blockButtons = [];
  if (section.id || section.items) {
    blocks && blocks.forEach((block) => {
      if (block.key === section.id) {
        if (section.type === "paragraph") {
          blockButtons.push({ block, val });
        }
        if (section.type === "blockquote" || section.type === "code") {
          blockButtons.push({ block, val });
        }
      }
      if (section.type === "list") {
        section.items.forEach((item) => {
          if (item.id === block.key) {
            block.type = "block-list";
            blockButtons.push({
              block,
              val: document.createElement("div")
            });
          }
        });
      }
    });
  }
  return blockButtons;
}
function addEmbedReferences(val, embeds, section) {
  const embedButtons = [];
  embeds.forEach((embed) => {
    if (section.pos === embed.pos.start.line) {
      if (section.type === "paragraph") {
        embedButtons.push({ block: embed, val });
      }
      if (section.type === "blockquote" || section.type === "code") {
        embedButtons.push({ block: embed, val });
      }
    }
    if (section.type === "list") {
      section.items.forEach((item) => {
        if (item.key === embed.key && item.position.start.line === embed.pos.start.line) {
          embed.type = "link-list";
          embedButtons.push({
            block: embed,
            val: document.createElement("div")
          });
        }
      });
    }
  });
  return embedButtons;
}
function addLinkReferences(val, links, section) {
  const linkButtons = [];
  links.forEach((link) => {
    if (section.type === "paragraph" && section.pos === link.pos.start.line) {
      linkButtons.push({ block: link, val });
    }
    if (section.type === "list") {
      section.items.forEach((item, index) => {
        const buttons2 = val.querySelectorAll("li");
        if (item.pos === link.pos.start.line) {
          link.type = "link-list";
          linkButtons.push({ block: link, val: buttons2[index] });
        }
      });
    }
  });
  return linkButtons;
}
function addHeaderReferences(val, headings, section) {
  const headerButtons = [];
  if (headings) {
    headings.forEach((header) => {
      header.pos.start.line === section.pos && headerButtons.push({ block: header, val });
    });
  }
  return headerButtons;
}

// src/livePreview.ts
var import_view2 = __toModule(require("@codemirror/view"));
var import_state = __toModule(require("@codemirror/state"));
var ButtonWidget = class extends import_view2.WidgetType {
  constructor(count, block) {
    super();
    this.count = count;
    this.block = block;
  }
  toDOM() {
    const countEl = createCounter(this.block, this.count);
    return countEl;
  }
  ignoreEvent() {
    return false;
  }
};
function buttons(plugin, view) {
  var _a;
  const buttons2 = plugin.createPreview(plugin);
  const note = plugin.app.workspace.getActiveFile().basename;
  let widgets = [];
  for (const { from, to } of view.visibleRanges) {
    for (const button of buttons2) {
      if (button.block.pos.start.offset >= from && button.block.pos.end.offset <= to && button.block.references && button.block.references.length > 0 && button.block.page === note) {
        const deco = import_view2.Decoration.widget({
          widget: new ButtonWidget((_a = button.block) == null ? void 0 : _a.references.length, button.block)
        });
        widgets.push(deco.range(button.block.pos.end.offset));
      }
    }
  }
  widgets = widgets.sort((a, b) => a.from - b.from).reduce((acc, widget) => {
    if (acc.length === 0) {
      return [widget];
    }
    const last = acc[acc.length - 1];
    if (last.from === widget.from) {
      return acc;
    }
    return [...acc, widget];
  }, []);
  return import_view2.Decoration.set(widgets);
}
function blockRefCounterPlugin(plugin) {
  return import_view2.ViewPlugin.fromClass(class {
    constructor(view) {
      this.effects = [];
      this.decorations = buttons(plugin, view);
    }
    update(update) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = buttons(plugin, update.view);
      }
    }
  }, {
    decorations: (v) => v.decorations,
    eventHandlers: {
      mousedown: (e, view) => {
        const target = e.target;
        if (target.classList.contains("block-ref-count")) {
          const id = target.dataset.blockRefId;
          const block = plugin.buttons.filter((button) => button.block.key === id)[0].block;
          const pos = view.posAtDOM(target);
          const effects = [
            addReferences.of({
              to: pos,
              app: plugin.app,
              block
            })
          ];
          if (!view.state.field(referencesField, false)) {
            effects.push(import_state.StateEffect.appendConfig.of(referencesField));
          }
          view.dispatch({ effects });
        }
      }
    }
  });
}
var referencesWidget = class extends import_view2.WidgetType {
  constructor(app, block) {
    super();
    this.app = app;
    this.block = block;
  }
  toDOM() {
    const val = document.createElement("div");
    const { tableType } = getSettings();
    if (tableType === "basic") {
      createRefTableElement(this.app, this.block, val);
    }
    if (tableType === "search") {
      createSearchElement(this.app, this.block, val);
    }
    return val;
  }
};
var referencesDecoration = (app, block) => {
  return import_view2.Decoration.widget({
    widget: new referencesWidget(app, block),
    side: 2,
    block: true
  });
};
var addReferences = import_state.StateEffect.define();
var referencesField = import_state.StateField.define({
  create() {
    return import_view2.Decoration.none;
  },
  update(references2, tr) {
    let exists = false;
    references2 = references2.map(tr.changes);
    for (const e of tr.effects)
      if (e.is(addReferences)) {
        references2 = references2.update({
          filter: (_from, to) => {
            if (to === e.value.to) {
              exists = true;
            }
            return to !== e.value.to;
          }
        });
        if (!exists) {
          references2 = references2.update({
            add: [
              referencesDecoration(e.value.app, e.value.block).range(e.value.to)
            ]
          });
        }
      }
    return references2;
  },
  provide: (f) => import_view2.EditorView.decorations.from(f)
});

// src/main.ts
var BlockRefCounter = class extends import_obsidian5.Plugin {
  constructor() {
    super(...arguments);
    this.buttons = [];
    this.createPreview = createPreviewView;
  }
  onload() {
    return __async(this, null, function* () {
      console.log("loading plugin: Block Reference Counter");
      yield this.loadSettings();
      this.settings = getSettings();
      this.addSettingTab(new BlockRefCountSettingTab(this.app, this));
      const indexDebounce = (0, import_obsidian5.debounce)(() => {
        buildLinksAndReferences(this.app);
      }, 3e3, true);
      const previewDebounce = (0, import_obsidian5.debounce)(() => {
        this.buttons = [];
        this.buttons = createPreviewView(this);
      }, 500, true);
      this.app.workspace.onLayoutReady(() => {
        unloadSearchViews(this.app);
        const resolved = this.app.metadataCache.on("resolved", () => {
          this.app.metadataCache.offref(resolved);
          if (this.settings.indexOnVaultOpen) {
            buildLinksAndReferences(this.app);
            this.buttons = createPreviewView(this);
            const activeView = this.app.workspace.getActiveViewOfType(import_obsidian5.MarkdownView);
            if (activeView) {
              const file = activeView.file;
              this.page = getCurrentPage({ file, app: this.app });
            }
          }
          this.registerEditorExtension([
            blockRefCounterPlugin(this),
            referencesField
          ]);
        });
      });
      this.registerView("search-ref", (leaf) => {
        if (!this.app.viewRegistry.getViewCreatorByType("search")) {
          return;
        }
        const newView = this.app.viewRegistry.getViewCreatorByType("search")(leaf);
        newView.getViewType = () => "search-ref";
        return newView;
      });
      this.registerEvent(this.app.vault.on("delete", () => {
        indexDebounce();
      }));
      this.registerEvent(this.app.workspace.on("layout-change", () => {
        if (this.settings.indexOnLayoutChange) {
          indexDebounce();
          previewDebounce();
        }
      }));
      this.registerEvent(this.app.workspace.on("file-open", (file) => {
        if (this.settings.indexOnFileOpen) {
          indexDebounce();
          this.page = getCurrentPage({ file, app: this.app });
          previewDebounce();
        }
      }));
      this.registerEvent(this.app.metadataCache.on("resolve", (file) => {
        if (this.settings.indexOnFileChange) {
          indexDebounce();
          this.page = getCurrentPage({ file, app: this.app });
          previewDebounce();
        }
      }));
      this.registerMarkdownPostProcessor((el, ctx) => {
        const sectionInfo = ctx.getSectionInfo(el);
        const lineStart = sectionInfo && sectionInfo.lineStart;
        if (this.page && lineStart) {
          const processed = processPage(this.page, this.app, el, lineStart);
          if (processed.length > 0) {
            const ids = this.buttons.map((button) => button.block.key);
            processed.forEach((item) => {
              if (!ids.includes(item.block.key)) {
                this.buttons.push(item);
              }
            });
          }
        }
      });
    });
  }
  onunload() {
    console.log("unloading plugin: Block Reference Counter");
    unloadButtons(this.app);
    unloadSearchViews(this.app);
  }
  loadSettings() {
    return __async(this, null, function* () {
      const newSettings = yield this.loadData();
      updateSettings(newSettings);
    });
  }
  saveSettings() {
    return __async(this, null, function* () {
      yield this.saveData(getSettings());
    });
  }
};
function unloadButtons(app) {
  let buttons2;
  const activeLeaf = app.workspace.getActiveViewOfType(import_obsidian5.MarkdownView);
  if (activeLeaf) {
    buttons2 = activeLeaf.containerEl.querySelectorAll("#count");
  }
  buttons2 && buttons2.forEach((button) => button.remove());
}
function unloadSearchViews(app) {
  app.workspace.getLeavesOfType("search-ref").forEach((leaf) => leaf.detach());
}
