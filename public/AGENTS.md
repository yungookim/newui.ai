# Landing Page Guidelines

This document covers patterns and conventions specific to the n.codes landing page (`public/index.html`) and demo (`public/demo/`).

## File Structure

- `index.html` — Main landing page (single-file with inline CSS)
- `changelog.html` — Product changelog
- `demo/` — Interactive demo application
  - `index.html` — Demo page structure
  - `styles.css` — Demo-specific styles
  - `app.js` — Demo interactivity
- `og.html` — Open Graph image generator
- Static assets: favicons, `robots.txt`, `sitemap.xml`

## CSS Architecture

### Design Tokens
All colors and spacing use CSS custom properties defined in `:root`:
```css
--bg-body: #050505;
--bg-card: #0f0f0f;
--border-color: #262626;
--text-main: #ededed;
--text-muted: #a1a1aa;
--accent: #4ade80;
```

Always use these tokens instead of hardcoded values.

### Mobile Breakpoint
The primary mobile breakpoint is `600px`:
```css
@media (max-width: 600px) {
  /* Mobile styles */
}
```

## Mobile-First Patterns

### Navigation
On mobile, nav items appear above the logo using `flex-direction: column-reverse`:
```css
.top-header {
  flex-direction: column-reverse;
  align-items: stretch;
}
```

### Tables
For data tables on mobile:
1. Hide non-essential columns using `nth-child`:
   ```css
   .app-table th:nth-child(3),
   .app-table td:nth-child(3) {
     display: none;
   }
   ```
2. Reduce padding and font sizes
3. Stack action buttons vertically

### General Mobile Rules
- Reduce container `padding-top` (120px → 24px)
- Stack flex layouts vertically when needed
- Reduce font sizes proportionally
- Ensure touch targets are at least 44px

## Testing Checklist

Before committing landing page changes:
1. Test at desktop width (1200px+)
2. Test at tablet width (~768px)
3. Test at mobile width (375px - 600px)
4. Verify no horizontal overflow
5. Check touch target sizes on interactive elements

Use browser dev tools device emulation or resize the browser window.

## Inline SVG Icons

Use inline SVGs with `fill="currentColor"` to inherit link colors:
```html
<a href="..." aria-label="X (Twitter)">
  <svg fill="currentColor" ...>
```

Always include `aria-label` when replacing text with icons.

## Performance

- No build step — keep it simple
- Inline critical CSS in `<style>` tag
- Preconnect to Google Fonts
- Use `live-server` for local development with hot reload
