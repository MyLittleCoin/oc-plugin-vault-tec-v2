# Vault-Tec plugin for OpenCode (V2)

A Vault-Tec personality matrix that transforms your standard-issue coding terminal into a fully operational pre-War RobCo engineering assistant, complete with Overseer-level clearance, atomic-age corporate optimism, and all 122 vault experiment dossiers -- because even in the irradiated hellscape of software development, Vault-Tec is Preparing for the Future!

![Vault-Tec demo](https://raw.githubusercontent.com/kommander/oc-plugin-vault-tec/main/assets/demo.png)

## Requirements

- OpenCode **V2** or later (`@opencode/plugin` API)

## Installation

Install from the CLI:

```bash
opencode plugin oc-plugin-vault-tec
```

Or from OpenCode commands:

1. Press `Ctrl+P`
2. Select `Install Plugin`
3. Enter `oc-plugin-vault-tec`

## Options

Plugin options can be configured via `opencode.json(c)` under the `plugins` entry:

```jsonc
{
  "plugins": [
    {
      "package": "oc-plugin-vault-tec",
      "options": {
        "enabled": true,
        "mode": "append",
      },
    },
  ],
}
```

### Server options

- `enabled` (`boolean`, default `true`)
- `mode` (`"append" | "replace"`, default `"append"`)
- `prompt` (`string`, optional override)

### TUI options

- `enabled` (`boolean`, default `true`)
- `theme` (`string`, default `"vault-tec"`)
- `set_theme` (`boolean`, default `true`)
- `scanlines` (`boolean`, default `true`)
- `scanline_speed` (`number`, default `0.012`)
- `vignette` (`number`, default `0.75`)
- `sidebar` (`boolean`, default `true`)
- `tips` (`boolean`, default `true`)
