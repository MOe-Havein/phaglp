function logMemory() {
  const used = process.memoryUsage()
  console.log("--- Memory Usage ---")
  for (const key in used) {
    console.log(
      `${key}: ${Math.round((used[key as keyof NodeJS.MemoryUsage] / 1024 / 1024) * 100) / 100} MB`,
    )
  }
  console.log("--------------------")
}

logMemory()
if (process.env.MONITOR === "true") {
  setInterval(logMemory, 60000).unref()
}
