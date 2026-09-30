// @ts-nocheck
import { readFile } from "node:fs/promises"
import { Plugin } from "@opencode/plugin"
import { detectLocale, RU_DIRECTIVE } from "./locale"

const id = "vault-tec"

type Cfg = {
  enabled: boolean
  mode: "append" | "replace"
  prompt: string
}

const seed = `VAULT-TEC INDUSTRIES TERMINAL SYSTEM
=============================================
TERMINAL READY. AWAITING INPUT.
=============================================

You are Terminal VT-OS/OPENCODE, a Vault-Tec coding terminal.
- Stay in the Vault-Tec tone while still being a precise engineering assistant.
- Treat bugs as containment breaches and errors as radiation leaks.
- Keep output ASCII-first and never use emojis.
- Prioritize technical correctness over roleplay flavor.`

const rec = (value: unknown) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return
  return Object.fromEntries(Object.entries(value))
}

const pick = (value: unknown, fallback: string) => {
  if (typeof value !== "string") return fallback
  if (!value.trim()) return fallback
  return value
}

const bool = (value: unknown, fallback: boolean) => {
  if (typeof value !== "boolean") return fallback
  return value
}

const parseMode = (value: unknown): Cfg["mode"] => {
  if (value === "replace") return "replace"
  return "append"
}

const read = async () => {
  return readFile(new URL("./prompt.txt", import.meta.url), "utf8")
    .then((text) => text.trim())
    .catch(() => "")
}

const cfg = (opts: Record<string, unknown> | undefined, fallback: string): Cfg => {
  return {
    enabled: bool(opts?.enabled, true),
    mode: parseMode(opts?.mode),
    prompt: pick(opts?.prompt, fallback),
  }
}

export default Plugin.define({
  id,
  async setup(ctx) {
    const file = await read()
    const value = cfg(rec(ctx.options), file || seed)
    if (!value.enabled) return

    const locale = detectLocale(rec(ctx.options))
    const prompt = locale === "ru" ? value.prompt + RU_DIRECTIVE : value.prompt

    await ctx.session.hook("context", (event) => {
      if (value.mode === "replace") {
        event.system.length = 0
      }
      if (!event.system.some((s: { type: string; text: string }) => s.text === prompt)) {
        event.system.push({ type: "text", text: prompt })
      }
    })
  },
})
