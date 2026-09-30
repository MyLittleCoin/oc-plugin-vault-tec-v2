// @ts-nocheck
import { usePlugin } from "@opencode/plugin/tui"

/**
 * CRT phosphor fallback palette (Vault-Tec green monochrome).
 * Used only when the host's PluginContext provider is missing, so a slot
 * can never crash the TUI with "PluginContextProvider is missing".
 */
const fallbackTheme: Record<string, string> = {
  primary: "#33FF33",
  text: "#33FF33",
  textMuted: "#1F8F1F",
  background: "#0A0F0A",
  success: "#33FF33",
  warning: "#B8E986",
  error: "#FF5555",
  info: "#33FF33",
  border: "#1F8F1F",
  borderActive: "#33FF33",
}

/**
 * Safety-wrapper around usePlugin(). Never throws: returns null when the
 * host did not provide a plugin context. Every slot render must be paired
 * with a PluginContextProvider, but even if that ever regresses, components
 * degrade silently instead of showing the crash dialog.
 */
export const safePlugin = () => {
  try {
    return usePlugin()
  } catch {
    return null
  }
}

export const safeTheme = () => {
  const plugin = safePlugin()
  return (plugin?.theme ?? fallbackTheme) as Record<string, string>
}
