import type { DangerDSLType, MarkdownString } from 'danger'

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

function mapToFileToProgrammingLanguage(files: string[]) {
  return new Set(files.map((file) => {
    const extension = file.split('.').pop();
    if(extension) {
      return programmingLanguages[extension]
    }

    return null
  }).filter(Boolean))
}

export function dangerWrapper(danger: DangerDSLType, message: (message: MarkdownString, file?: string, line?: number) => void) {

  async function getFileDiff(prFiles: string[]) {
    const files = [];
    for (const file of prFiles) {
      files.push(danger.git.diffForFile(file));
    }

    return Promise.all(files)
  }

  async function extractPullRequestData() {
    const files = [...danger.git.modified_files, ...danger.git.created_files, ...danger.git.deleted_files]
    const diffsContent = await getFileDiff(files);
    return {
      paths: files,
      languages: [...mapToFileToProgrammingLanguage(files)],
      content: diffsContent.map(diffContent => diffContent?.diff)
    }
  }

  function createComment(comment: MarkdownString) {
    message(comment)
  }

  return {
    getPullRequestData: extractPullRequestData,
    createComment
  }
}