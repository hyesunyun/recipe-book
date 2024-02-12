function displayResults (results, store) {
  const searchResults = document.getElementById('results')
  if (results.length) {
    let resultList = ''
    // Iterate and build result list elements
    for (const n in results) {
      const item = store[results[n].ref]
      // This is basically box.html partial.
      // I just don't know how to incorporate it in this way.
      resultList += `<a class="box" href="${item.url}" aria-label="${item.title}">
      <div class="is-flex">
        <figure class="image is-48x48" style="margin-right: 0.5em;">
          <img alt="${ ".."+item.featured_image }" class="is-rounded" src="${ ".."+item.featured_image }" />
        </figure>
        <div>
          <div>${item.title}`
      if ("spicy" in item.tags) {
        resultList += '<span class="icon has-text-danger"><i class="fas fa-pepper-hot"></i></span>'
      }
      resultList += `</div>
          <small class="has-text-grey">${item.summary}</small>
        </div>
      </div>
      <div style="margin-top: 0.5em;">
        <span class="tag is-primary is-light">${item.time}</span>
        <span class="tag is-link is-light">${item.servings}</span>`
      for (const tag of item.tags) {
        if (tag !== "spicy") {
          resultList += `<span class="tag">${ tag }</span>`
        }
      }
      resultList += '</div></a>'
    }
    searchResults.innerHTML = resultList
  } else {
    searchResults.innerHTML = 'No results found.'
  }
}

// Get the query parameter(s)
const params = new URLSearchParams(window.location.search)
const query = params.get('query')

// Perform a search if there is a query
if (query) {
  // Retain the search input in the form when displaying results
  document.getElementById('search-input').setAttribute('value', query)

  const idx = lunr(function () {
    this.ref('id')
    this.field('title', {
      boost: 20
    })
    this.field('tags', {
      boost: 10
    })
    this.field('content', {
      boost: 15
    })
    this.field('description', {
      boost: 10
    })
    this.field('summary', {
      boost: 10
    })
    this.field('time', {
      boost: 5
    })
    this.field('servings', {
      boost: 5
    })
    
    for (const key in window.store) {
      this.add({
        id: key,
        title: window.store[key].title,
        tags: window.store[key].category,
        content: window.store[key].content,
        description: window.store[key].description,
        summary: window.store[key].summary,
        url: window.store[key].url,
        time: window.store[key].time,
        servings: window.store[key].servings,
      })
    }
  })

  // Perform the search
  const results = idx.search(query)
  // Update the list with results
  displayResults(results, window.store)
}