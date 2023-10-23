interface Map {
  [key: string]: string | undefined
}

const programmingLanguages: Map = {
  "js": "javascript",
  "jsx": "javascript",
  "mjs": "javascript",
  "ts": "typescript",
  "tsx": "typescript",
  "java": "java",
  "class": "java",
  "kt": "kotlin",
  "kts": "kotlin",
  "py": "python",
  "ex": "elixir",
  "exs": "elixir",
  "eex": "elixir"
};

export function mapToFileToProgrammingLanguage(files: string[]) {
  return new Set(files.map((file) => {
    const extension = file.split('.').pop();
    if(extension) {
      return programmingLanguages[extension]
    }

    return null
  }).filter(Boolean))
}