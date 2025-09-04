import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

export interface Config {
  id: string
  userId: string
  mode: "demo" | "n8n" | "openai" | "custom"
  webhookUrl: string
  systemStyle: string
  apiKey: string
  createdAt: string
  updatedAt: string
}

const configPath = join(process.cwd(), "data", "config.json")

export function getConfigs(): Config[] {
  try {
    const data = readFileSync(configPath, "utf8")
    return JSON.parse(data).configs
  } catch {
    return []
  }
}

export function saveConfigs(configs: Config[]) {
  writeFileSync(configPath, JSON.stringify({ configs }, null, 2))
}

export function getUserConfig(userId: string): Config | null {
  const configs = getConfigs()
  return configs.find((config) => config.userId === userId) || null
}

export function saveUserConfig(userId: string, configData: Partial<Config>): Config {
  const configs = getConfigs()
  const existingConfigIndex = configs.findIndex((config) => config.userId === userId)

  const now = new Date().toISOString()

  if (existingConfigIndex >= 0) {
    // Update existing config
    configs[existingConfigIndex] = {
      ...configs[existingConfigIndex],
      ...configData,
      updatedAt: now,
    }
    saveConfigs(configs)
    return configs[existingConfigIndex]
  } else {
    // Create new config
    const newConfig: Config = {
      id: Date.now().toString(),
      userId,
      mode: "demo",
      webhookUrl: "",
      systemStyle: "You are Nova AI, a helpful assistant that provides clear, concise, and friendly responses.",
      apiKey: "",
      createdAt: now,
      updatedAt: now,
      ...configData,
    }
    configs.push(newConfig)
    saveConfigs(configs)
    return newConfig
  }
}
