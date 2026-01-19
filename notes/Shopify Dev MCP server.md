---
title: Shopify Dev MCP server
description: >-
  Use the Shopify Dev MCP server to integrate development tools with AI
  assistants for building Shopify apps and integrations.
source_url:
  html: 'https://shopify.dev/docs/apps/build/devmcp'
  md: 'https://shopify.dev/docs/apps/build/devmcp.md'
---

# Shopify Dev MCP server

Connect your AI assistant to Shopify's development resources. The Shopify Dev Model Context Protocol (MCP) server enables your AI assistant to search Shopify docs, explore API schemas, build Functions, and get up-to-date answers about Shopify APIs.

***

## How it works

Your AI assistant uses the MCP server to read and interact with Shopify's development resources:

1. Ask your AI assistant to build something or help with Shopify development tasks.
2. The assistant searches Shopify documentation and API schemas based on your prompt.
3. The MCP server gives your AI assistant access to Shopify's development resources, so it can provide accurate code, solutions, and guidance based on current APIs and best practices.

***

## Requirements

Before you set up the Dev MCP server, make sure you have:

* **Node.js 18 or higher** installed on your system.
* An **AI development tool** that supports MCP, such as Cursor or Gemini CLI.

***

## What you can ask your AI assistant

After you set up the MCP server, you can ask your AI assistant questions like:

* "How do I create a product using the Admin API?"
* "What fields are available on the Order object?"
* "Show me an example of a webhook subscription"
* "How do I authenticate my Shopify app?"
* "What's the difference between Admin API and Storefront API?"
* "Build a new POS UI extension that shows all the product SKUs of the order in the order details screen"

Your AI assistant will use the MCP server to search Shopify's documentation when providing responses.

***

## Supported APIs

The MCP server provides tools to interact with the following Shopify APIs:

* [Admin GraphQL API](https://shopify.dev/docs/api/admin-graphql)
* [Customer Account API](https://shopify.dev/docs/api/customer)
* [Functions](https://shopify.dev/docs/api/functions)
* [Liquid](https://shopify.dev/docs/api/liquid)
* [Partner API](https://shopify.dev/docs/api/partner)
* [Payment Apps API](https://shopify.dev/docs/api/payments-apps)
* [Polaris Web Components](https://shopify.dev/docs/api/polaris)
* [POS UI Extensions](https://shopify.dev/docs/api/pos-ui-extensions)
* [Storefront API](https://shopify.dev/docs/api/storefront)

***

## Set up the server

The server runs locally in your development environment and doesn't require authentication.

### Step 1: Configure your AI development tool

Add configuration code that tells your AI tool how to connect to and use the Dev MCP server. This configuration enables your AI assistant to automatically access Shopify documentation, API schemas, and development guidance when you ask questions.

#### Cursor

1. Open Cursor and go to **Cursor** > **Settings** > **Cursor Settings** > **Tools and integrations** > **New MCP server**.

2. Add this configuration to your MCP servers (or [use this link](https://cursor.com/en/install-mcp?name=shopify-dev-mcp\&config=eyJjb21tYW5kIjoibnB4IC15IEBzaG9waWZ5L2Rldi1tY3BAbGF0ZXN0In0%3D) to add it automatically):

   ## Cursor configuration

   ```json
   {
     "mcpServers": {
       "shopify-dev-mcp": {
         "command": "npx",
         "args": ["-y", "@shopify/dev-mcp@latest"]
       }
     }
   }
   ```

   If you see connection errors on Windows, try this alternative configuration:

   ## Alternative configuration for Windows

   ```json
   {
     "mcpServers": {
       "shopify-dev-mcp": {
         "command": "cmd",
         "args": ["/k", "npx", "-y", "@shopify/dev-mcp@latest"]
       }
     }
   }
   ```

   Note

   For more information, see the [Cursor MCP documentation](https://docs.cursor.com/context/model-context-protocol).

3. Save your configuration and restart Cursor.

#### Claude Code

1. Add the Dev MCP server using the Claude CLI command:

   ## Terminal

   ```terminal
   claude mcp add --transport stdio shopify-dev-mcp -- npx -y @shopify/dev-mcp@latest
   ```

   Note

   For more information, see the [Claude Code MCP documentation](https://code.claude.com/docs/en/mcp#option-3%3A-add-a-local-stdio-server).

2. Restart Claude Code to load the new MCP server configuration.

#### Claude Desktop

1. Open Claude Desktop and access your configuration file through settings.

2. Add this configuration to your MCP servers section:

   ## Claude Desktop configuration

   ```json
   {
     "mcpServers": {
       "shopify-dev-mcp": {
         "command": "npx",
         "args": ["-y", "@shopify/dev-mcp@latest"]
       }
     }
   }
   ```

   Note

   For more information, read the [Claude Desktop MCP guide](https://modelcontextprotocol.io/quickstart/user).

3. Save your configuration and restart Claude Desktop.

#### Codex CLI

1. Add this configuration to your `~/.codex/config.toml` file:

   ## Codex configuration

   ```toml
   [mcp_servers.shopify-dev-mcp]
   command = "npx"
   args = ["-y", "@shopify/dev-mcp@latest"]
   ```

   Note

   Codex uses TOML format with `mcp_servers` (snake\_case) instead of JSON with `mcpServers` (camelCase). For more information, see the [Codex MCP documentation](https://github.com/openai/codex/blob/main/docs/config.md#mcp_servers).

2. Restart Codex to load the new MCP server configuration.

#### Gemini CLI

1. Add the [Dev MCP server extension](https://github.com/shopify/dev-mcp-gemini-cli) using the Gemini CLI command:

   ## Terminal

   ```terminal
   gemini extensions install https://github.com/shopify/dev-mcp-gemini-cli
   ```

   Or you can manually add this configuration in your `settings.json` file:

   ## Gemini CLI configuration

   ```json
   {
     "mcpServers": {
       "shopify-dev-mcp": {
         "command": "npx",
         "args": ["-y", "@shopify/dev-mcp@latest"]
       }
     }
   }
   ```

   Note

   By default, this adds the server to your project configuration. To make it available across all projects, add the `--scope user` flag. For more information, see the [Gemini CLI MCP documentation](https://google-gemini.github.io/gemini-cli/docs/tools/mcp-server.html).

2. Restart Gemini CLI to load the new MCP server configuration.

### Step 2: (Optional) Configure advanced options

The Dev MCP server supports several advanced configuration options:

#### Disable instrumentation

This package makes instrumentation calls to better understand how to improve the MCP server. To disable them, set the `OPT_OUT_INSTRUMENTATION` environment variable in Cursor or Claude Desktop:

## Disable instrumentation

```json
{
  "mcpServers": {
    "shopify-dev-mcp": {
      "command": "npx",
      "args": ["-y", "@shopify/dev-mcp@latest"],
      "env": {
        "OPT_OUT_INSTRUMENTATION": "true"
      }
    }
  }
}
```

#### Liquid and Theme validation support

You can control the validation mode by setting `LIQUID_VALIDATION_MODE` in the environment:

* `full` (default, recommended): Enables the [`validate_theme`](#validate_theme) tool for validating entire theme directories.
* `partial` (not recommended): Enables the [`validate_theme_codeblocks`](#validate_theme_codeblocks) tool for validating individual codeblocks. Only use this for self-contained Liquid files that don't require theme context.

## Configure the validation mode

```json
{
  "mcpServers": {
    "shopify-dev-mcp": {
      "command": "npx",
      "args": ["-y", "@shopify/dev-mcp@latest"],
      "env": {
        "LIQUID_VALIDATION_MODE": "full"
      }
    }
  }
}
```

***

## Available tools

The Dev MCP server provides the following tools:

### `learn_shopify_api`

Teaches the LLM about supported Shopify APIs and how to use this MCP server's tools to generate valid code blocks for each API. This tool makes a request to [shopify.dev](https://shopify.dev) to get the most up-to-date instruction for how to best work with the API the user would need to use for their prompt.

Note

Always call this tool first when working with Shopify APIs. It provides essential context about supported APIs and generates a conversation ID for tracking usage across tool calls.

***

### `search_docs_chunks`

Search across all [shopify.dev](https://shopify.dev) documentation to find relevant chunks matching your query.

Best for broad research across multiple topics or when you're not sure where to look. Returns quick results from many sections, though individual snippets might lack full context.

***

### `fetch_full_docs`

Retrieve complete documentation for specific paths from [shopify.dev](https://shopify.dev). Provides full context without chunking loss, but requires knowing the exact path. Paths are provided via [`learn_shopify_api`](#learn_shopify_api).

***

### `introspect_graphql_schema`

Explore and search Shopify GraphQL schemas to find specific types, queries, and mutations.

Essential for GraphQL development - discover what fields, queries, and mutations are available before writing your operations, along with the necessary access scopes.

***

### `validate_graphql_codeblocks`

Validate GraphQL code blocks against a specific GraphQL schema to ensure they don't contain hallucinated fields or operations.

Use when generating or modifying GraphQL code to ensure it doesn't contain fields or operations that don't exist in Shopify's API.

***

### `validate_component_codeblocks`

Validates JavaScript and TypeScript code blocks containing Shopify components against the schema to ensure they don't contain hallucinated components, props, or prop values.

Use when generating or modifying component code to ensure it uses only valid components and properties that exist in Shopify's component libraries.

***

### `validate_theme_codeblocks`

Validates individual Liquid codeblocks and supporting theme files (JSON, CSS, JS, SVG) to ensure correct syntax and references.

Limited use case

This tool only works for self-contained Liquid files generated by the LLM. If the generated files require any context from an existing theme, this isn't the right choice. Use [`validate_theme`](#validate_theme) instead for comprehensive theme validation.

Requires `LIQUID_VALIDATION_MODE=partial` in your [MCP server configuration](#liquid-and-theme-validation-support).

***

### `validate_theme`

Validates entire theme directories using Shopify's Theme Check to detect errors in Liquid syntax, missing references, and other theme issues.

Run this on complete themes to catch cross-file issues and ensure consistency. Applies all [Theme Check rules](https://shopify.dev/docs/storefronts/themes/tools/theme-check) for comprehensive validation.

Note

This tool is enabled by default when `LIQUID_VALIDATION_MODE=full`.

***

## Related resources

[Shopify CLI\
\
](https://shopify.dev/docs/apps/build/cli-for-apps)

[Command-line tool for building Shopify apps and themes.](https://shopify.dev/docs/apps/build/cli-for-apps)

[Storefront MCP\
\
](https://shopify.dev/docs/apps/build/storefront-mcp)

[Connect AI assistants to real-time commerce data for customer-facing shopping experiences.](https://shopify.dev/docs/apps/build/storefront-mcp)

***