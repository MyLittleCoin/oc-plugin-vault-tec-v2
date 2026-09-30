# Vault-Tec plugin for OpenCode (V2)

A Vault-Tec personality matrix that transforms your standard-issue coding terminal into a fully operational pre-War RobCo engineering assistant, complete with Overseer-level clearance, atomic-age corporate optimism, and all 122 vault experiment dossiers -- because even in the irradiated hellscape of software development, Vault-Tec is Preparing for the Future!

![Vault-Tec demo](https://raw.githubusercontent.com/kommander/oc-plugin-vault-tec/main/assets/demo.png)

## Requirements

- OpenCode **V2** or later (`@opencode/plugin` API)

## Installation

### From config (recommended)

Add the plugin to `opencode.json` (project or global, or `.opencode/opencode.json`):

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "plugins": [
    {
      "package": "github:MyLittleCoin/oc-plugin-vault-tec-v2",
      "options": {
        "enabled": true,
        "mode": "append",
      },
    },
  ],
}
```

OpenCode clones the repository into its plugin cache and installs the dependencies automatically. Restart the TUI (or the server) to load it.

### From the CLI

```bash
opencode plugin add github:MyLittleCoin/oc-plugin-vault-tec-v2
```

The in-app installer works the same way: press `Ctrl+P`, select `Install Plugin`, and paste the GitHub spec above.

### Pinning a revision

Any npm-compatible git spec is accepted:

- `github:MyLittleCoin/oc-plugin-vault-tec-v2#main` — pin a branch or tag
- `github:MyLittleCoin/oc-plugin-vault-tec-v2#<commit-sha>` — pin a commit
- `git+ssh://git@github.com/MyLittleCoin/oc-plugin-vault-tec-v2.git#main`

## Options

Plugin options can be configured via `opencode.json(c)` under the `plugins` entry:

```jsonc
{
  "plugins": [
    {
      "package": "github:MyLittleCoin/oc-plugin-vault-tec-v2",
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
