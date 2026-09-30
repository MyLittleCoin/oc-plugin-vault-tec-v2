// @ts-nocheck
/** @jsxImportSource @opentui/solid */
import { safePlugin, safeTheme } from "./safe-plugin"
import { createMemo, For, Show } from "solid-js"

type Part = {
  text: string
  on: boolean
}

const split = (tip: string): Part[] => {
  const list: Part[] = []
  const exp = /\{highlight\}(.*?)\{\/highlight\}/g
  const hit = Array.from(tip.matchAll(exp))
  const out = hit.reduce(
    (state, item) => {
      const start = item.index ?? 0
      if (start > state.i) {
        state.list.push({
          text: tip.slice(state.i, start),
          on: false,
        })
      }
      state.list.push({
        text: item[1] ?? "",
        on: true,
      })
      state.i = start + item[0].length
      return state
    },
    {
      list,
      i: 0,
    },
  )

  if (out.i < tip.length) {
    out.list.push({
      text: tip.slice(out.i),
      on: false,
    })
  }

  return out.list
}

const msgs = [
  "Type {highlight}@{/highlight} then a filename to load records into your Overseer request.",
  "Start with {highlight}!{/highlight} to run terminal maintenance commands like {highlight}!git status{/highlight}.",
  "Press {highlight}Ctrl+P{/highlight} to open the Overseer action board.",
  "Run {highlight}/review{/highlight} before every surface excursion; audits preserve Vault stability.",
  "Use {highlight}/models{/highlight} or {highlight}Ctrl+X M{/highlight} to switch approved cognition engines.",
  "Press {highlight}Ctrl+X N{/highlight} to open a fresh incident log.",
  "Use {highlight}/sessions{/highlight} or {highlight}Ctrl+X L{/highlight} to resume prior containment work.",
  "Run {highlight}/compact{/highlight} when context gets hot to keep reactor load in safe limits.",
  "Press {highlight}Shift+Enter{/highlight} for newlines while drafting long directives.",
  "Press {highlight}Escape{/highlight} to halt the agent mid-stream during unsafe output.",
  "Run {highlight}/status{/highlight} or {highlight}Ctrl+X S{/highlight} to inspect Vault system health.",
  "Configure local settings in {highlight}.opencode/tui.json{/highlight} and central policy in {highlight}opencode.jsonc{/highlight}.",
  "Use {highlight}/connect{/highlight} to authorize additional providers for emergency compute routing.",
  "Store reusable command scripts in {highlight}.opencode/command/{/highlight} for repeat drills.",
  "Create role profiles in {highlight}.opencode/agent/{/highlight} for specialized response teams.",
  "Vault-Tec reminds all residents: regular commits reduce panic and improve morale.",
  "Vault-Tec is not responsible for data corruption caused by unreviewed force pushes.",
  "Prepare for the future: run {highlight}/help{/highlight} whenever keyboard protocol memory degrades.",
]

const Roll = () => {
  const theme = safeTheme()
  const list = createMemo(() => split(msgs[Math.floor(Math.random() * msgs.length)] ?? msgs[0]!))
  return (
    <box flexDirection="row" maxWidth="100%">
      <text flexShrink={0} style={{ fg: theme.warning }}>
        ● Vault Tip{" "}
      </text>
      <text flexShrink={1}>
        <For each={list()}>
          {(part) => <span style={{ fg: part.on ? theme.text : theme.textMuted }}>{part.text}</span>}
        </For>
      </text>
    </box>
  )
}

export const Tips = () => {
  const plugin = safePlugin()
  if (!plugin) return null
  const theme = plugin.theme

  const [tipsState] = plugin.storage.memory("tips", { initial: { hidden: false } })
  const sessionCount = createMemo(() => (plugin.data.session.list() ?? []).length)
  const show = createMemo(() => sessionCount() > 0 && !tipsState.hidden)

  return (
    <box height={4} minHeight={0} width="100%" maxWidth={75} alignItems="center" paddingTop={3} flexShrink={1}>
      <Show when={show()}>
        <Roll />
      </Show>
    </box>
  )
}
