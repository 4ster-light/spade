Deno.test("BASE CASE WITH MOCK: 'post.md'", async () => {
  const output = await new Deno.Command("deno", {
    args: ["run", "--allow-read", "--allow-write", "main.ts", "post.md"],
    stdout: "piped",
    stderr: "piped",
  }).output()

  if (output.code !== 0) {
    const error = new TextDecoder().decode(output.stderr)
    console.error("Error:", error)
    throw new Error(error)
  }

  const result = new TextDecoder().decode(output.stdout)
  console.log(result)

  const expectedOutput = "Successfully converted 'post.md' to 'post.html'\n"
  if (!result.includes(expectedOutput))
    throw new Error(`Expected output to include "${expectedOutput}", but got "${result}"`)

  await Deno.remove("post.html").catch((error) => {
    if (error instanceof Deno.errors.NotFound) throw new Error("'post.html' not found for cleanup.")
    else throw new Error(`Error removing post.html: ${error}`)
  })
})
