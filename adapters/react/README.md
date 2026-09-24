# React adapter

Small components over `components/components.css`, so the class names and
accessibility wiring are done for you.

```jsx
import "design-kit/tokens/base.css";
import "design-kit/skins/studio.css";
import "design-kit/components/components.css";
import { SkinProvider, Button, Badge, Card, Field, Stat, Callout, Eyebrow } from "design-kit/adapters/react/index.jsx";

export default function Page() {
  return (
    <SkinProvider skin="studio">
      <Eyebrow>September</Eyebrow>
      <Stat label="Received this month" value="€31,905" delta="▲ 12.4% vs Aug" trend="up" />
      <Field label="Email" type="email" hint="We'll send the export here." />
      <Button variant="primary">Export month</Button>
      <Badge tone="warning" dot>3 need receipts</Badge>
    </SkinProvider>
  );
}
```

| Component | Props |
|---|---|
| `SkinProvider` | `skin` (id), `mode` = `auto` \| `light` \| `dark` |
| `Button` | `variant` = `default` \| `primary` \| `ghost`, `size` = `sm` \| `md` \| `lg`, `href` |
| `Badge` | `tone` = `neutral` \| `accent` \| `success` \| `warning` \| `danger`, `dot` |
| `Card` | `variant` = `default` \| `flat` \| `well`, `href` |
| `Field` | `label`, `hint`, `error`, `as` = `input` \| `textarea` \| `select`, plus any input props |
| `Stat` | `label`, `value`, `delta`, `trend` = `up` \| `down` |
| `Callout` | `tone` = `default` \| `danger` |
| `Eyebrow` | `as` (tag) |

For fonts, add the skin's Google Fonts link from `skins/registry.js` to your document head.
