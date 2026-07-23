# Site Configuration Guide

All your site content and design settings are centralized in **`src/config.ts`**. You can edit everything here without touching any code!

## How to Edit in VS Code

1. Open the file: **`src/config.ts`**
2. Make your changes to the values
3. Save the file (Ctrl+S / Cmd+S)
4. The dev server will automatically reload your changes

---

## Configuration Sections

### 1. **Site Information**
```typescript
site: {
  name: 'Your Business',              // Your business name
  tagline: 'Professional Solutions',  // One-line tagline
  description: 'A modern business...', // SEO description
  url: 'https://example.com',         // Your domain
  author: 'Your Name',                // Your name
}
```

**Where it appears:**
- Footer (site name and description)
- Browser title
- Search engine results

---

### 2. **Contact Information**
```typescript
contact: {
  email: 'hello@example.com',
  phone: '+1 (555) 123-4567',
  linkedin: 'https://linkedin.com/in/yourprofile',
  twitter: 'https://twitter.com/yourprofile',
  formspreeId: 'YOUR_FORMSPREE_ID',  // See setup below
}
```

**Where it appears:**
- Contact page
- Footer
- Contact form action

### **Setting up Formspree (One-time setup)**
1. Go to https://formspree.io/
2. Sign up with your email
3. Create a new project
4. You'll get a Form ID (looks like: `fxxxxxxxxx`)
5. Replace `YOUR_FORMSPREE_ID` with your actual ID
6. Test the form on `/contact` page

---

### 3. **Colors**
```typescript
colors: {
  bg: '#f8fbff',              // Main background
  surface: '#ffffff',         // Cards and surfaces
  surface2: '#f2f6ff',        // Secondary background
  text: '#0f172a',            // Primary text color
  muted: '#475569',           // Secondary text
  accent: '#2563eb',          // Primary action (buttons, links)
  accentDark: '#1d4ed8',      // Hover state for accent
  border: '#dbeafe',          // Borders and dividers
  shadow: '0 12px 40px...',   // Drop shadow effect
}
```

**To change colors:**
1. Edit the hex values (e.g., `#2563eb`)
2. Use a color picker like: https://htmlcolorcodes.com/
3. Save and reload

**Pro tips:**
- Keep good contrast between text and background for accessibility
- Test your colors on https://contrast-ratio.com/
- Use a color palette generator: https://coolors.co/

---

### 4. **Hero Section (Homepage)**
```typescript
hero: {
  title: 'Modern Solutions for Your Business',
  subtitle: 'Build something amazing...',
  ctaText: 'Book a Consultation',        // Button text
  ctaLink: '/contact',                   // Button link
}
```

**Where it appears:**
- Top of the homepage with large text and image

---

### 5. **Services**
```typescript
services: [
  {
    id: 'strategy',
    title: 'Strategic Planning',
    description: 'Develop a roadmap for growth',
    benefits: ['Benefit 1', 'Benefit 2', 'Benefit 3'],
    icon: '📊',  // Use emoji or leave blank
  },
  // Add more services...
]
```

**Where it appears:**
- Services page (card layout)
- Homepage (services overview section)

**To add a new service:**
```typescript
{
  id: 'unique-id',
  title: 'Service Name',
  description: 'Short description',
  benefits: ['Benefit 1', 'Benefit 2'],
  icon: '🎯',
},
```

---

### 6. **Testimonials**
```typescript
testimonials: [
  {
    quote: 'Great feedback from client...',
    author: 'Client Name',
    company: 'Company Name',
    image: '/testimonials/name.jpg',  // Optional
  },
  // Add more testimonials...
]
```

**Where it appears:**
- Homepage in "What clients say" section

**Note:** Keep quotes authentic and specific. Remove placeholder testimonials before launching.

---

### 7. **FAQ (Frequently Asked Questions)**
```typescript
faq: [
  {
    question: 'How quickly can we start?',
    answer: 'Most engagements begin within...',
  },
  // Add more FAQ items...
]
```

**Where it appears:**
- Contact page at the bottom

**Pro tips:**
- Answer 5-8 common questions
- Be specific and helpful
- Address objections and concerns

---

### 8. **About Section**
```typescript
about: {
  intro: 'Passionate about helping businesses succeed...',
  mission: 'To empower businesses with strategic insights...',
  values: [
    { title: 'Excellence', description: 'We strive for...' },
    // Add more values...
  ],
  experience: '10+ years of experience...',
}
```

**Where it appears:**
- About page
- Used for company profile and credibility

---

### 9. **Social Links**
```typescript
social: {
  linkedin: 'https://linkedin.com/in/yourprofile',
  twitter: 'https://twitter.com/yourprofile',
  github: 'https://github.com/yourprofile',
  email: 'hello@example.com',
}
```

**Note:** These are fallback links. Primary social links come from `contact` section.

---

## Common Changes

### Change your business name
1. Open `src/config.ts`
2. Find `site.name: 'Your Business'`
3. Change to your business name
4. Saves everywhere the name appears

### Change accent color
1. Open `src/config.ts`
2. Find `colors.accent: '#2563eb'`
3. Change to your color (hex code)
4. Updates buttons, links, and accents across the entire site

### Add a service
1. Open `src/config.ts`
2. Find the `services` array
3. Add a new object:
```typescript
{
  id: 'new-service',
  title: 'Your Service Name',
  description: 'What you offer',
  benefits: ['Benefit 1', 'Benefit 2', 'Benefit 3'],
  icon: '🎯',
},
```
4. Save and it appears on Services page

### Update contact email
1. Open `src/config.ts`
2. Find `contact.email`
3. Change the email address
4. Updates in footer, contact page, and mailto links

### Customize homepage hero text
1. Open `src/config.ts`
2. Find `hero` object
3. Update `title`, `subtitle`, `ctaText`, and `ctaLink`
4. Appears on homepage hero section

---

## Tips & Best Practices

✅ **Do:**
- Keep descriptions concise (1-2 sentences)
- Use action-oriented language in CTAs
- Update testimonials with real client feedback
- Test your changes by viewing the site locally
- Use consistent terminology throughout

❌ **Don't:**
- Use placeholder content in testimonials before launch
- Leave broken links or incomplete information
- Make the site name too long or generic
- Use colors with poor contrast (test at contrast-ratio.com)

---

## File Structure

```
src/
├── config.ts              ← 📝 EDIT THIS FILE
├── pages/
│   ├── index.astro        (Uses config data)
│   ├── about.astro        (Uses config data)
│   ├── services.astro     (Uses config data)
│   └── contact.astro      (Uses config data)
└── styles/
    └── global.css         (Color variables)
```

---

## Deployment

### Update site URL before deploying
In `src/config.ts`, change:
```typescript
site: {
  url: 'https://example.com',  // ← Change this to your actual domain
  // ...
}
```

This is used for:
- Sitemap generation
- Canonical URLs
- Social sharing metadata

---

## Need Help?

- **Color picker:** https://htmlcolorcodes.com/
- **Color contrast checker:** https://contrast-ratio.com/
- **Font pairing ideas:** https://www.fontpair.co/
- **Emoji picker:** https://emoji-picker.com/

---

**That's it!** You can now customize your entire site by editing `src/config.ts`. No coding required.
