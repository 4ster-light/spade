import { marked } from "marked"
import { Command } from "commander"

async function readFile(filename: string): Promise<string> {
  return await Deno.readTextFile(filename)
    .catch((error) => {
      error instanceof Deno.errors.NotFound
        ? console.error(`Error: File not found - ${filename}`)
        : console.error(`Error reading file: ${filename}`, error)
      Deno.exit(1)
    })
}

async function writeFile(filename: string, data: string): Promise<void> {
  await Deno.writeTextFile(filename, data)
    .catch((error) => {
      console.error(`Error writing file: ${filename}`, error)
      Deno.exit(1)
    })
}

function getOutputFilename(filename: string): string {
  const parts = filename.split(".")
  if (parts.length > 1) parts.pop() // Remove the extension
  return parts.join(".") + ".html"
}

function main(): void {
  const program = new Command()

  program
    .name("spade")
    .description("A simple static site generator")
    .version("0.1.0")

  program
    .argument("<filename>", "Markdown file to convert")
    .usage("<filename>")
    .action(async (filename: string) => {
      const markdown = await readFile(filename)
      const html = await marked(markdown)
      const outputFilename = getOutputFilename(filename)

      await writeFile(outputFilename, html)
        .then(() => console.log(`Successfully converted '${filename}' to '${outputFilename}'`))
    })

  program.parse(Deno.args, { from: "user" })
}

if (import.meta.main) main()
