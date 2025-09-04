"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConfigDialog({ open, onOpenChange }: ConfigDialogProps) {
  const [mode, setMode] = useState("demo")
  const [webhookUrl, setWebhookUrl] = useState("")
  const [systemStyle, setSystemStyle] = useState("")
  const [apiKey, setApiKey] = useState("")

  const handleSave = async () => {
    const config = {
      mode,
      webhookUrl,
      systemStyle,
      apiKey,
    }

    // Save to localStorage for immediate use
    localStorage.setItem("nova-config", JSON.stringify(config))

    // Save to server if user is logged in
    const userStr = localStorage.getItem("nova-user")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        await fetch("/api/config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            ...config,
          }),
        })
      } catch (error) {
        console.error("Error saving config to server:", error)
      }
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configuration</DialogTitle>
          <DialogDescription>
            Configure how Nova AI connects to your services and generates responses.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="connection" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="connection" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Connection Mode</CardTitle>
                <CardDescription>Choose how Nova AI should generate responses.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mode">Mode</Label>
                  <Select value={mode} onValueChange={setMode}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="demo">Demo (Client-side)</SelectItem>
                      <SelectItem value="n8n">n8n Webhook</SelectItem>
                      <SelectItem value="openai">OpenAI API</SelectItem>
                      <SelectItem value="custom">Custom Endpoint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {mode === "n8n" && (
                  <div className="space-y-2">
                    <Label htmlFor="webhook">Webhook URL</Label>
                    <Input
                      id="webhook"
                      placeholder="https://your-n8n-instance.com/webhook/..."
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Your n8n webhook should return JSON: {"{"}"reply": "response text"{"}"}
                    </p>
                  </div>
                )}

                {mode === "openai" && (
                  <div className="space-y-2">
                    <Label htmlFor="apikey">OpenAI API Key</Label>
                    <Input
                      id="apikey"
                      type="password"
                      placeholder="sk-..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>
                )}

                {mode === "custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="endpoint">Custom Endpoint</Label>
                    <Input
                      id="endpoint"
                      placeholder="https://your-api.com/chat"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="style" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Response Style</CardTitle>
                <CardDescription>Customize how Nova AI responds to match your brand voice.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="system-style">System Style Prompt</Label>
                  <Textarea
                    id="system-style"
                    placeholder="You are a helpful assistant that responds in a friendly, professional tone..."
                    value={systemStyle}
                    onChange={(e) => setSystemStyle(e.target.value)}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    This prompt will be used to guide Nova's response style and personality.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSystemStyle("Respond in a friendly, casual tone. Be helpful and approachable.")}
                  >
                    Friendly
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSystemStyle("Respond in a professional, formal tone. Be concise and direct.")}
                  >
                    Professional
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSystemStyle("Respond concisely. Keep answers brief and to the point.")}
                  >
                    Concise
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Additional configuration options for power users.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Message History</Label>
                  <p className="text-sm text-muted-foreground">
                    Messages are stored locally in your browser. Clear history to start fresh.
                  </p>
                  <Button variant="outline" size="sm">
                    Clear History
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Export/Import</Label>
                  <p className="text-sm text-muted-foreground">
                    Export your configuration or import settings from a file.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Export Config
                    </Button>
                    <Button variant="outline" size="sm">
                      Import Config
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Configuration</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
