# UI/UX DESIGN TASK — TIKI PRODUCT INTELLIGENCE

## 1. Project Overview

Design and implement a professional mobile application interface named **Tiki Product Intelligence** using React Native.

This application is a product analytics platform that visualizes product information collected from Tiki Vietnam.

The application allows users to explore product information, monitor prices, view analytics dashboards, and explore machine learning insights.

**IMPORTANT: This task is strictly limited to UI/UX design and frontend presentation.**

The developer will independently implement all business logic, backend services, APIs, databases, scraping systems, authentication, and machine learning functionality.

Your responsibility is ONLY to create the visual interface and frontend presentation.

## 2. Technology Stack

- React Native
- Expo
- TypeScript
- Expo Router
- NativeWind or StyleSheet
- Lucide icons for React Native
- React Native chart library for visualizations

Use the existing project configuration if a project has already been initialized. Do not unnecessarily reinstall or replace dependencies.

## 3. Design Direction

Create a premium SaaS-style mobile application inspired by modern products such as Linear, Stripe Dashboard, and professional business intelligence platforms.

### Visual Style

- Modern and minimal.
- Professional analytics interface.
- Clean layouts.
- Strong visual hierarchy.
- Consistent spacing.
- Subtle borders and shadows.
- Carefully designed cards.
- Excellent typography.
- Native mobile experience.

Avoid generic dashboard templates and excessive decorative elements.

### Color Palette

Use Light Mode as the default theme.

| Token | Color |
|---|---|
| Primary | #2563EB |
| Primary Dark | #1D4ED8 |
| Background | #F8FAFC |
| Surface | #FFFFFF |
| Text Primary | #0F172A |
| Text Secondary | #64748B |
| Border | #E2E8F0 |
| Success | #16A34A |
| Warning | #F59E0B |
| Danger | #DC2626 |

Typography: Inter.

## 4. Application Navigation

Create a Bottom Tab Navigation with five sections:

1. Overview
2. Products
3. Analytics
4. AI Insights
5. Profile

Requirements:
- Consistent navigation across screens.
- Clear active and inactive states.
- Appropriate icons.
- Smooth navigation transitions.
- Native-feeling interaction.

## 5. Screens to Design

### 5.1 Overview Dashboard

Design a professional analytics dashboard containing:

- Welcome header.
- Current date.
- Notification icon.
- KPI cards:
  - Total Products.
  - Total Categories.
  - Average Product Price.
  - Total Stores.
- Product collection activity chart.
- Product price distribution chart.
- Top product categories.
- Recently updated products.
- Recent activity section.

### 5.2 Products Explorer

Design a product browsing interface containing:

- Search bar.
- Category filters.
- Price range filters.
- Sorting controls.
- Product list.
- Product thumbnails.
- Product names.
- Current prices.
- Original prices.
- Discount labels.
- Ratings and review counts.

Product cards should look professional and analytical rather than like traditional e-commerce shopping cards.

### 5.3 Product Detail

Design a detailed product information screen containing:

- Product image gallery.
- Product name.
- Product ID.
- Category.
- Current price.
- Original price.
- Rating.
- Review count.
- Store information.
- Product description.
- Historical price chart.
- Price statistics.
- Data collection history.

Make the historical price chart a major visual element.

### 5.4 Analytics Dashboard

Design a data visualization interface containing:

- Total products analyzed.
- Average price by category.
- Product price distribution.
- Category comparison.
- Product collection trends.
- Top-rated products.
- Price change analysis.

Use:
- Line charts.
- Bar charts.
- Donut charts.
- Area charts.

Ensure charts have readable labels, legends, and attractive layouts.

### 5.5 AI Insights

Design a machine learning insights interface containing:

- AI overview.
- Price prediction cards.
- Product clustering visualization.
- Price anomaly detection.
- Category trends.
- AI-generated insight cards.

Each card should visually display:
- Insight title.
- Short description.
- Related product or category.
- Confidence score.
- Last updated timestamp.

Use a sophisticated and restrained AI visual style.

### 5.6 Profile & Settings

Design a profile interface containing:

- User avatar.
- User information.
- Account settings.
- Notification preferences.
- Theme settings.
- Application information.
- Data source information.
- Logout button.

Also include a visually separate Admin section for:
- Scraping status.
- Scraping history.
- Number of collected products.
- Last scraping timestamp.
- Synchronization status.

These are UI elements only.

## 6. UI Components

Create reusable presentation components:

- AppHeader
- BottomTabBar
- StatCard
- ProductCard
- SearchBar
- FilterChip
- CategoryCard
- ChartCard
- PriceHistoryChart
- InsightCard
- EmptyState
- LoadingSkeleton
- ErrorState
- SectionHeader
- CustomButton
- CustomInput

Maintain consistent styling throughout the application.

## 7. Mock Data & Interaction

Use static mock data exclusively to populate the interface.

You MAY implement:
- Tab navigation.
- Screen navigation.
- Opening and closing modals.
- UI-only search input.
- Visual filter selection.
- UI-only sorting demonstrations.
- Chart touch interactions.
- Expandable sections.
- Loading skeleton demonstrations.
- Empty and error state demonstrations.

You MUST NOT implement:
- Backend communication.
- API requests.
- Database operations.
- Web scraping.
- Authentication systems.
- Business logic.
- Price prediction algorithms.
- Machine learning algorithms.
- Data processing pipelines.
- Real-time synchronization.

Do not create fake API services or pretend mock data is real data.

## 8. Code Organization

Keep the frontend code clean and maintainable.

Suggested structure:

src/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   ├── products.tsx
│   │   ├── analytics.tsx
│   │   ├── insights.tsx
│   │   └── profile.tsx
│   ├── product/
│   │   └── [id].tsx
│   └── _layout.tsx
├── components/
│   ├── common/
│   ├── dashboard/
│   ├── products/
│   ├── analytics/
│   └── insights/
├── constants/
├── mock-data/
├── types/
└── assets/

This structure is a suggestion. Adapt it to the existing project configuration.

## 9. Important Development Constraints

1. Focus exclusively on frontend UI/UX.
2. Do not implement backend functionality.
3. Do not modify or create database schemas.
4. Do not create API endpoints.
5. Do not implement scraping or machine learning.
6. Do not introduce unnecessary dependencies.
7. Use reusable components.
8. Maintain consistent design tokens.
9. Ensure compatibility with both iOS and Android.
10. Keep the code easy for another developer to extend.

## 10. Expected Deliverables

Deliver:

- Complete mobile application UI.
- All five main screens.
- Product detail screen.
- Reusable UI component library.
- Consistent design system.
- Navigation between screens.
- Static mock data.
- Responsive mobile layouts.
- Loading, empty, and error states.

## FINAL INSTRUCTION

Your task is to act as a professional Mobile UI/UX Designer and React Native Frontend Developer.

Build a visually polished, production-quality frontend interface for Tiki Product Intelligence.

**Only implement presentation and UI-level interactions. Leave all business logic, data processing, backend integration, and application functionality to the project owner.**
