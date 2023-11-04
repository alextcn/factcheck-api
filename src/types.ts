type MisleadingItems = {
  quote: string
  reason_for_doubt: string
  danger_level: string
  search_queries: string[]
}

type SearchResponse = {
  news?: {
    results: {
      title: string
      url: string
      description: string
      thumbnail: string
    }[]
  }
  web: {
    results: {
      title: string
      url: string
      description: string
    }[]
  }
  infobox?: {
    results: {
      title: string
      url: string
      long_desc: string
    }[]
  }
}
