import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs"
import { join, dirname } from "path"

export class JSONDatabase {
  private filePath: string

  constructor(fileName: string) {
    this.filePath = join(process.cwd(), "data", fileName)
    this.ensureDirectoryExists()
  }

  private ensureDirectoryExists() {
    const dir = dirname(this.filePath)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
  }

  read<T = any>(defaultValue: T): T {
    try {
      if (!existsSync(this.filePath)) {
        this.write(defaultValue)
        return defaultValue
      }
      const data = readFileSync(this.filePath, "utf8")
      return JSON.parse(data)
    } catch (error) {
      console.error(`Error reading ${this.filePath}:`, error)
      return defaultValue
    }
  }

  write<T = any>(data: T): void {
    try {
      writeFileSync(this.filePath, JSON.stringify(data, null, 2))
    } catch (error) {
      console.error(`Error writing ${this.filePath}:`, error)
      throw error
    }
  }

  update<T = any>(updater: (data: T) => T, defaultValue: T): T {
    const currentData = this.read(defaultValue)
    const newData = updater(currentData)
    this.write(newData)
    return newData
  }
}

// Database instances
export const usersDB = new JSONDatabase("users.json")
export const messagesDB = new JSONDatabase("messages.json")
export const configDB = new JSONDatabase("config.json")
export const conversationsDB = new JSONDatabase("conversations.json")

// Initialize databases with default structure
export function initializeDatabases() {
  usersDB.read({ users: [] })
  messagesDB.read({ messages: [] })
  configDB.read({ configs: [] })
  conversationsDB.read({ conversations: [] })
}
