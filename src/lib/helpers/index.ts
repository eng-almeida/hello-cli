import { SpawnOptionsWithoutStdio, spawn } from "node:child_process"


export const spawnAsPromise = async (command: string, args?: readonly string[] | undefined, options?: SpawnOptionsWithoutStdio | undefined) => 
  new Promise<string>((resolve) => {
    let stdout = ""
    const child = spawn(command, args, options)

    child.stdout.on('data', (chunk) => {
      stdout += chunk
    })

    child.stderr.on('data', (data) => {
      throw new Error(data)
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve(stdout)
      }
    })
  })