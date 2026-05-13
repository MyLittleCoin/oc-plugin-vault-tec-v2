// @ts-nocheck
/** @jsxImportSource @opentui/solid */
import { useKeyboard } from "@opentui/solid"
import type { TuiPluginApi } from "@opencode-ai/plugin/tui"
import { createMemo, createSignal } from "solid-js"

type Api = TuiPluginApi

export type SettingsState = {
  set: boolean
  scan: boolean
  scanSpeed: number
  vignette: number
  sidebar: boolean
  tips: boolean
}

export type ToggleField = "set" | "scan" | "sidebar" | "tips"
export type NumberField = "scanSpeed" | "vignette"
export type Field = ToggleField | NumberField

type SettingRow = {
  key: Field
  title: string
  description: string
  category: string
  kind: "toggle" | "number"
  step?: number
  min?: number
  max?: number
  digits?: number
}

const rows: SettingRow[] = [
  {
    key: "set",
    title: "Apply Vault-Tec theme",
    description: "Set configured theme when enabled",
    category: "Visual",
    kind: "toggle",
  },
  {
    key: "scan",
    title: "CRT scanlines",
    description: "Animated v-sync bands",
    category: "Visual",
    kind: "toggle",
  },
  {
    key: "scanSpeed",
    title: "Scanline speed",
    description: "Animation speed for v-sync bands",
    category: "Visual",
    kind: "number",
    step: 0.002,
    min: 0,
    digits: 3,
  },
  {
    key: "vignette",
    title: "Vignette strength",
    description: "Screen edge darkening strength",
    category: "Visual",
    kind: "number",
    step: 0.05,
    min: 0,
    max: 1,
    digits: 2,
  },
  {
    key: "sidebar",
    title: "Vault side panel",
    description: "Companion art and monitor card",
    category: "Layout",
    kind: "toggle",
  },
  {
    key: "tips",
    title: "Vault tips",
    description: "Custom home screen guidance",
    category: "Home",
    kind: "toggle",
  },
]

export const settingByField = Object.fromEntries(rows.map((item) => [item.key, item])) as Record<Field, SettingRow>

export const createSettingKey = (id: string) => {
  return {
    set: `${id}.setting.set_theme`,
    scan: `${id}.setting.scanlines`,
    scanSpeed: `${id}.setting.scanline_speed`,
    vignette: `${id}.setting.vignette`,
    sidebar: `${id}.setting.sidebar`,
    tips: `${id}.setting.tips`,
  } as const
}

const status = (value: boolean) => {
  return value ? "ON" : "OFF"
}

const metric = (value: SettingsState, key: NumberField) => {
  if (key === "scanSpeed") return value.scanSpeed.toFixed(3)
  return value.vignette.toFixed(2)
}

export const SettingsDialog = (props: {
  api: Api
  value: () => SettingsState
  flip: (key: ToggleField) => void
  tune: (key: NumberField, dir: -1 | 1) => void
}) => {
  const [cur, setCur] = createSignal<Field>(rows[0]?.key ?? "set")
  const theme = createMemo(() => props.api.theme.current)
  const DialogSelect = props.api.ui.DialogSelect

  const current = createMemo(() => settingByField[cur()] ?? settingByField.set)
  const options = createMemo(() => {
    const value = props.value()
    return rows.map((item) => {
      const footer = item.kind === "toggle" ? status(value[item.key]) : metric(value, item.key)
      return {
        title: item.title,
        value: item.key,
        description: item.description,
        category: item.category,
        footer,
      }
    })
  })

  useKeyboard((evt) => {
    const item = current()
    if (!item) return

    if (evt.name === "space" && item.kind === "toggle") {
      evt.preventDefault()
      evt.stopPropagation()
      props.flip(item.key)
      return
    }

    if (evt.name !== "left" && evt.name !== "right") return
    evt.preventDefault()
    evt.stopPropagation()
    if (item.kind === "toggle") {
      props.flip(item.key)
      return
    }
    props.tune(item.key, evt.name === "left" ? -1 : 1)
  })

  return (
    <box flexDirection="column">
      <DialogSelect
        title="Vault-Tec settings"
        placeholder="Filter settings"
        options={options()}
        current={cur()}
        onMove={(item) => setCur(item.value)}
        onSelect={(item) => {
          setCur(item.value)
          const next = settingByField[item.value]
          if (next?.kind === "toggle") {
            props.flip(next.key)
          }
        }}
      />
      <box paddingRight={2} paddingLeft={4} flexDirection="row" gap={2} paddingTop={1} paddingBottom={1} flexShrink={0}>
        <text>
          <span style={{ fg: theme().text }}>
            <b>toggle</b>{" "}
          </span>
          <span style={{ fg: theme().textMuted }}>space enter left/right</span>
        </text>
        <text>
          <span style={{ fg: theme().text }}>
            <b>adjust</b>{" "}
          </span>
          <span style={{ fg: theme().textMuted }}>left/right</span>
        </text>
      </box>
    </box>
  )
}
