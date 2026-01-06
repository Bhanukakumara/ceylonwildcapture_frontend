# Reusable UI Components

This directory contains reusable UI components for the Ceylon Wild Capture application. These components provide a consistent design system and simplify development.

## Components

### Title
A flexible heading component that supports all heading levels (h1-h6).

**Props:**
- `children` (ReactNode) - Content to display
- `level` (1-6) - Heading level, defaults to 1
- `className` (string) - Additional CSS classes
- `gradient` (boolean) - Apply gradient text effect
- `dataAos` (string) - AOS animation type
- `dataAosDelay` (string) - AOS animation delay

**Example:**
```tsx
import { Title } from './components/ui';

<Title level={1} gradient dataAos="fade-up">
    Welcome to <span className="gradient-text">Ceylon Wild Capture</span>
</Title>
```

---

### Paragraph
A paragraph component with size and color variants.

**Props:**
- `children` (ReactNode) - Content to display
- `className` (string) - Additional CSS classes
- `size` ('sm' | 'md' | 'lg') - Text size, defaults to 'md'
- `color` ('default' | 'muted' | 'light' | 'white') - Text color, defaults to 'default'
- `dataAos` (string) - AOS animation type
- `dataAosDelay` (string) - AOS animation delay

**Example:**
```tsx
import { Paragraph } from './components/ui';

<Paragraph size="lg" color="light" dataAos="fade-up">
    Discover stunning wildlife photography from Sri Lanka.
</Paragraph>
```

---

### Button
A button component with multiple variants and sizes.

**Props:**
- `children` (ReactNode) - Button text/content
- `variant` ('primary' | 'secondary' | 'ghost') - Button style, defaults to 'primary'
- `size` ('sm' | 'md' | 'lg') - Button size, defaults to 'md'
- `className` (string) - Additional CSS classes
- `onClick` (function) - Click handler
- `type` ('button' | 'submit' | 'reset') - Button type, defaults to 'button'
- `disabled` (boolean) - Disabled state
- `icon` (ReactNode) - Icon element
- `iconPosition` ('left' | 'right') - Icon position, defaults to 'left'

**Example:**
```tsx
import { Button } from './components/ui';

<Button 
    variant="primary" 
    size="lg" 
    onClick={handleClick}
    icon={<SearchIcon />}
>
    Search
</Button>
```

---

### Input
An input field component with icon support.

**Props:**
- `type` ('text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search') - Input type, defaults to 'text'
- `placeholder` (string) - Placeholder text
- `value` (string) - Input value
- `onChange` (function) - Change handler
- `className` (string) - Additional CSS classes
- `icon` (ReactNode) - Icon element
- `iconPosition` ('left' | 'right') - Icon position, defaults to 'left'
- `disabled` (boolean) - Disabled state
- `required` (boolean) - Required field
- `name` (string) - Input name
- `id` (string) - Input ID

**Example:**
```tsx
import { Input } from './components/ui';

<Input
    type="search"
    placeholder="Search wildlife..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    icon={<SearchIcon />}
    iconPosition="left"
/>
```

---

### Text
A versatile text component for inline and block text with various styling options.

**Props:**
- `children` (ReactNode) - Content to display
- `as` ('span' | 'div' | 'label' | 'p') - HTML element, defaults to 'span'
- `className` (string) - Additional CSS classes
- `size` ('xs' | 'sm' | 'md' | 'lg' | 'xl') - Text size, defaults to 'md'
- `weight` ('light' | 'normal' | 'medium' | 'semibold' | 'bold') - Font weight, defaults to 'normal'
- `color` ('default' | 'muted' | 'light' | 'white' | 'primary' | 'gradient') - Text color, defaults to 'default'
- `align` ('left' | 'center' | 'right') - Text alignment, defaults to 'left'

**Example:**
```tsx
import { Text } from './components/ui';

<Text as="div" size="xl" weight="bold" color="gradient">
    10,000+ Photos
</Text>

<Text as="p" size="sm" color="muted">
    User email or description
</Text>
```

---

## Usage

Import components individually or use the barrel export:

```tsx
// Individual imports
import Title from './components/ui/Title';
import Button from './components/ui/Button';

// Barrel import (recommended)
import { Title, Paragraph, Button, Input, Text } from './components/ui';
```

## Design System

All components follow the design system defined in `src/index.css`:

- **Colors**: Primary green (#10B981), secondary teal, accent lime
- **Typography**: Poppins font family
- **Spacing**: Consistent spacing scale (xs to 3xl)
- **Transitions**: Smooth animations (fast, normal, slow)
- **Effects**: Glassmorphism, gradients, shadows

## Customization

Each component accepts a `className` prop for additional styling. Components are designed to work seamlessly with the existing CSS variables and utility classes.
