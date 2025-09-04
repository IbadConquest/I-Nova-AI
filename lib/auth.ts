import bcrypt from "bcryptjs"
import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

export interface User {
  id: string
  email: string
  password: string
  name: string
  createdAt: string
}

const usersPath = join(process.cwd(), "data", "users.json")

export function getUsers(): User[] {
  try {
    const data = readFileSync(usersPath, "utf8")
    return JSON.parse(data).users
  } catch {
    return []
  }
}

export function saveUsers(users: User[]) {
  writeFileSync(usersPath, JSON.stringify({ users }, null, 2))
}

export async function createUser(email: string, password: string, name: string): Promise<User> {
  const users = getUsers()
  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser: User = {
    id: Date.now().toString(),
    email,
    password: hashedPassword,
    name,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveUsers(users)

  return newUser
}

export async function validateUser(email: string, password: string): Promise<User | null> {
  const users = getUsers()
  const user = users.find((u) => u.email === email)

  if (!user) return null

  const isValid = await bcrypt.compare(password, user.password)
  return isValid ? user : null
}
