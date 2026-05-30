import fs from "fs"
import path from "path"

const query = process.argv.slice(2).join(" ")

if (!query) {
  console.log("Usage: node search-docs.mjs <search-query>")
  console.log("Example: node search-docs.mjs environment variables")
  process.exit(0)
}

async function searchDocs() {
  console.log(`Searching Vercel documentation for: "${query}"...`)

  try {
    const url = `https://html.duckduckgo.com/html/?q=site:vercel.com/docs+${encodeURIComponent(query)}`
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!response.ok) {
      console.error(`Search failed. Status: ${response.status}`)
      process.exit(1)
    }

    const html = await response.text()

    // Parse results
    // Results are contained in <div class="result results_links results_links_deep web-result">
    const resultBlocks = html.split('class="result results_links results_links_deep web-result">')
    resultBlocks.shift() // remove header

    const results = []

    for (const block of resultBlocks.slice(0, 5)) {
      // Extract URL
      const urlMatch = block.match(/<a class="result__url"[^>]*>([^<]+)/)
      // Extract Title
      const titleMatch = block.match(/<a class="result__url" href="([^"]+)"/)
      const displayTitleMatch = block.match(/<a class="result__snippet"[^>]*>([\s\S]*?)<\/a>/)

      const rawUrl = titleMatch ? titleMatch[1] : ""
      // DuckDuckGo redirects through uddg parameter
      let cleanUrl = rawUrl
      if (rawUrl.includes("uddg=")) {
        const uParam = new URL(rawUrl).searchParams.get("uddg")
        if (uParam) cleanUrl = decodeURIComponent(uParam)
      }

      // Clean title from block
      const headingMatch = block.match(/<a class="result__link"[^>]*>([\s\S]*?)<\/a>/)
      const title = headingMatch ? headingMatch[1].replace(/<[^>]*>/g, "").trim() : "Vercel Docs"

      // Extract Snippet
      const snippet = displayTitleMatch ? displayTitleMatch[1].replace(/<[^>]*>/g, "").trim() : ""

      if (cleanUrl) {
        results.push({
          title,
          url: cleanUrl,
          snippet,
        })
      }
    }

    console.log(`\nFound ${results.length} relevant Vercel documentation pages:\n`)

    results.forEach((res, index) => {
      console.log(`${index + 1}. **${res.title}**`)
      console.log(`   Link:    ${res.url}`)
      console.log(`   Summary: ${res.snippet}\n`)
    })
  } catch (error) {
    console.error("Error performing documentation search:", error)
  }
}

searchDocs()
