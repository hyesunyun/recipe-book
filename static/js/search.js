let pagesIndex, searchIndex;

async function initSearchIndex() {
  try {
    const response = await fetch("/index.json");
    pagesIndex = await response.json();
    searchIndex = lunr(function () {
      this.field("title");
      this.field("tags");
      this.field("contents");
      this.ref("permalink");
      this.ref("description");
      pagesIndex.forEach((page) => this.add(page));
    });
  } catch (e) {
    console.log(e);
  }
}

initSearchIndex();