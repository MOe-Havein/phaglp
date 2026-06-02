"use client"

import Script from "next/script"

export function FoxyLoader() {
  const subdomain = process.env.NEXT_PUBLIC_FOXY_STORE_SUBDOMAIN

  if (!subdomain) {
    return null
  }

  // Load the FoxyCart Loader script asynchronously
  return (
    <Script
      src={`https://cdn.foxycart.com/${subdomain}/loader.js`}
      strategy="lazyOnload"
      id="foxycart-loader"
    />
  )
}
