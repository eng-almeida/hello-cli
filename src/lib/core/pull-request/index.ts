import type { DangerDSLType, MarkdownString } from 'danger'
import { mapToFileToProgrammingLanguage } from './utils';

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
    extractPullRequestData,
    createComment
  }
}