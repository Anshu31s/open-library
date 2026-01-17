# 📚 Edzy Library — Infinite Open Library Explorer

A modern, responsive **book discovery app** built with **Next.js (App Router)**, **TypeScript**, **TailwindCSS**, **shadcn/ui**, and **React Query**.  
It uses the **OpenLibrary Search API** to fetch books with **infinite scrolling** + **virtualized rendering** for fast performance.

---

## 🚀 Features

### ✅ Core Requirements
- ✅ **OpenLibrary Search API integration**
- ✅ **Paginated fetching using React Query (`useInfiniteQuery`)**
- ✅ **Infinite scrolling** (auto-load next pages)
- ✅ **Virtualized book list** using `@tanstack/react-virtual`
- ✅ **Responsive grid layout**
- ✅ **Book cards** show:
  - Cover image
  - Title
  - Author
  - Publish year
  - Subject chips (first 3)
- ✅ Clean UI built using **shadcn/ui**

### 🎁 Bonus Features Implemented
- ✅ **Sort dropdown**: Relevance | Year (asc/desc)
- ✅ **Back to Top** floating button
- ✅ **Persist query in URL** (`?q=science`) and restore on reload
- ✅ **Placeholder cover UI** with gradient + icon when `cover_i` is missing
- ✅ Debounced search input (400ms)

---

## 🧱 Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript**
- **TailwindCSS**
- **shadcn/ui**
- **@tanstack/react-query**
- **@tanstack/react-virtual**
- **react-intersection-observer**
- **next-themes** (dark/light mode)
- **date-fns** (optional formatting)

---

## 📦 Installation

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd <your-project-folder>
npm install
