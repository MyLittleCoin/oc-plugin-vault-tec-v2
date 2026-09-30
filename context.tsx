// @ts-nocheck
/** @jsxImportSource @opentui/solid */
import { usePlugin } from "@opencode/plugin/tui"
import { createMemo, createSignal, Show } from "solid-js"

const bar = (ratio: number, width: number): string => {
  const r = Math.max(0, Math.min(1, ratio))
  const size = Math.max(1, width)
  const n = Math.round(r * size)
  return "\u2588".repeat(n) + "\u2591".repeat(size - n)
}

const fillWidth = (width: number, ...parts: string[]): number => {
  return Math.max(1, width - parts.reduce((sum, part) => sum + part.length, 0) - 2)
}

const pct = (ratio: number): string => {
  return Math.round(Math.max(0, Math.min(1, ratio)) * 100) + "%"
}

const fmt = (n: number): string => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"
  if (n >= 10_000) return Math.round(n / 1_000) + "K"
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K"
  return String(n)
}

const fmtCaps = (n: number): string => {
  if (n >= 1) return "$" + n.toFixed(2)
  if (n >= 0.01) return "$" + n.toFixed(3)
  return "$" + n.toFixed(4)
}

const toNumber = (value: unknown): number => {
  if (typeof value !== "number") return 0
  return Number.isFinite(value) ? value : 0
}

export const PipBoyContext = (props: { sessionId: string }) => {
  const plugin = usePlugin()
  const theme = plugin.theme

  const [barWidth, setBarWidth] = createSignal(12)
  const data = createMemo(() => {
    const messages = plugin.data.session.message.list(props.sessionId) ?? []

    let totalInput = 0
    let totalOutput = 0
    let totalCacheRead = 0
    let totalCost = 0
    let lastModelID = ""
    let lastProviderID = ""
    let lastMsg: any = null

    for (const msg of messages) {
      if (msg.role !== "assistant") continue
      if (msg.providerID && msg.modelID && (msg.tokens?.input > 0 || msg.tokens?.output > 0)) {
        lastMsg = msg
        lastModelID = msg.modelID
        lastProviderID = msg.providerID
      }
    }

    if (lastMsg) {
      totalInput = toNumber(lastMsg.tokens?.total) || toNumber(lastMsg.tokens?.input)
      totalOutput = toNumber(lastMsg.tokens?.output)
      totalCacheRead = toNumber(lastMsg.tokens?.cache?.read)
      totalCost = toNumber(lastMsg.cost)
    }

    let contextLimit = 0
    let outputLimit = 0

    const location = plugin.location ?? plugin.data.location.default()
    const providers = plugin.data.location.provider.list(location) ?? []

    for (const provider of providers) {
      const model = provider.id === lastProviderID ? provider.models?.[lastModelID] : undefined
      if (model) {
        contextLimit = model.limit?.context ?? 0
        outputLimit = model.limit?.output ?? 0
        break
      }
    }

    if (!contextLimit && lastModelID) {
      for (const provider of providers) {
        const model = provider.models?.[lastModelID]
        if (model) {
          contextLimit = model.limit?.context ?? 0
          outputLimit = model.limit?.output ?? 0
          break
        }
      }
    }

    const contextRatio = contextLimit > 0 ? Math.min(1, totalInput / contextLimit) : 0
    const outputRatio = outputLimit > 0 ? Math.min(1, totalOutput / outputLimit) : 0
    const cacheRatio = totalInput > 0 ? Math.min(1, totalCacheRead / totalInput) : 0

    return {
      totalInput,
      totalOutput,
      totalCacheRead,
      totalCost,
      contextLimit,
      outputLimit,
      contextRatio,
      outputRatio,
      cacheRatio,
      hasData: totalInput > 0 || totalOutput > 0,
    }
  })

  const ctxColor = createMemo(() => {
    const r = data().contextRatio
    if (r > 0.9) return theme.error
    if (r > 0.7) return theme.warning
    return theme.primary
  })

  const ctxInfo = createMemo(() => `${fmt(data().totalInput)} / ${fmt(data().contextLimit)} tokens`)
  const ctxPct = createMemo(() => ` ${pct(data().contextRatio)}`)
  const outInfo = createMemo(() => `${fmt(data().totalOutput)} / ${fmt(data().outputLimit)} tokens`)
  const outPct = createMemo(() => ` ${pct(data().outputRatio)}`)
  const cachePct = createMemo(() => ` ${pct(data().cacheRatio)}`)

  return (
    <Show when={data().hasData}>
      <box
        onSizeChange={function () {
          const next = Math.max(1, this.width)
          setBarWidth((prev) => (prev === next ? prev : next))
        }}
        paddingTop={1}
        width="100%"
        flexDirection="column"
      >
        <text fg={theme.primary}>
          <b>PIP-BOY 3000 MKIV</b>
        </text>
        <Show when={data().contextLimit > 0}>
          <text>
            <span style={{ fg: theme.textMuted }}>CTX </span>
            <span style={{ fg: ctxColor() }}>
              [{bar(data().contextRatio, fillWidth(barWidth(), "CTX ", ctxPct()))}]
            </span>
            <span style={{ fg: theme.text }}>{ctxPct()}</span>
          </text>
          <text fg={theme.textMuted}>{ctxInfo()}</text>
        </Show>
        <Show when={data().outputLimit > 0}>
          <text>
            <span style={{ fg: theme.textMuted }}>OUT </span>
            <span style={{ fg: theme.primary }}>
              [{bar(data().outputRatio, fillWidth(barWidth(), "OUT ", outPct()))}]
            </span>
            <span style={{ fg: theme.text }}>{outPct()}</span>
          </text>
          <text fg={theme.textMuted}>{outInfo()}</text>
        </Show>
        <text>
          <span style={{ fg: theme.textMuted }}>CSH </span>
          <span style={{ fg: theme.success }}>
            [{bar(data().cacheRatio, fillWidth(barWidth(), "CSH ", cachePct()))}]
          </span>
          <span style={{ fg: theme.text }}>{cachePct()}</span>
        </text>
        <text>
          <span style={{ fg: theme.textMuted }}>CAPS </span>
          <span style={{ fg: theme.warning }}>{fmtCaps(data().totalCost)}</span>
        </text>
      </box>
    </Show>
  )
}
