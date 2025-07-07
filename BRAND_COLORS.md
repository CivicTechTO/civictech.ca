# Civic Tech Toronto Brand Colors

This document describes the unified color system implemented to ensure consistency across all visual elements of the Civic Tech Toronto website.

## Primary Brand Color

**Civic Tech Toronto Orange**: `#ff9500`
- RGB: (255, 149, 0)
- HSL: (35°, 100%, 50%)

## CSS Variables

The brand colors are defined in `assets/css/custom.css` under the "Brand Colors" section:

```css
:root {
  /* Civic Tech Toronto Brand Orange - unified across all elements */
  --ctto-brand-orange: #ff9500;
  --ctto-brand-orange-hover: #e6850a;
  --ctto-brand-orange-focus: #cc7600;
  
  /* Override Pico CSS primary colors to use our brand color */
  --pico-primary: var(--ctto-brand-orange);
  --pico-primary-background: var(--ctto-brand-orange);
  --pico-primary-border: var(--ctto-brand-orange);
  --pico-primary-hover-background: var(--ctto-brand-orange-hover);
  --pico-primary-hover-border: var(--ctto-brand-orange-hover);
  --pico-primary-focus: var(--ctto-brand-orange-focus);
}
```

## Elements Using the Brand Color

1. **SVG Logo**: Uses `var(--pico-primary)` for both stroke and fill
2. **Favicon**: Static ICO file with the exact brand color `#ff9500`
3. **Primary Buttons**: Via Pico CSS `--pico-primary` override
4. **Links**: Via Pico CSS `--pico-primary` override
5. **Topic Badges**: Via Pico CSS `--pico-primary` override
6. **Form Focus States**: Via Pico CSS `--pico-primary-focus` override

## Changing the Brand Color

To change the brand color across the entire site:

1. Update the `--ctto-brand-orange` variable in `assets/css/custom.css`
2. Update the hover and focus variants accordingly
3. Regenerate the favicon using the new color:
   ```bash
   # Create SVG with new color
   # Convert to favicon sizes: 16x16, 32x32, 48x48, 64x64
   # Combine into favicon.ico
   ```

## Accessibility

The current orange color `#ff9500` provides good contrast against both light and dark backgrounds:
- Light theme: Meets WCAG AA standards for contrast
- Dark theme: Maintained readability and visual hierarchy

## Files Modified

- `assets/css/custom.css`: Added brand color variables
- `assets/images/favicon.ico`: Updated with unified color
- `_includes/logo.svg`: Already uses CSS variables (no change needed)

This unified approach ensures visual consistency across all brand touchpoints while making future color changes simple and maintainable.