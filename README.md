# memeup-theme

Shopify theme for `fpr1rr-q8.myshopify.com`, based on [Dawn](https://github.com/Shopify/dawn).

## Local development

Requires the [Shopify CLI](https://shopify.dev/docs/api/shopify-cli):

```bash
npm install -g @shopify/cli
shopify auth login
shopify theme dev --store=fpr1rr-q8.myshopify.com
```

This serves the theme locally with hot reload against the store's data.

## Deploying

- Pushes to `main` are automatically deployed to the **live** theme via
  `.github/workflows/deploy.yml`.
- Pull requests are linted with Theme Check via `.github/workflows/ci.yml`.

To push manually:

```bash
shopify theme push --store=fpr1rr-q8.myshopify.com
```
