# 📚 LMS — Learning Management System

A full-stack **Learning Management System** built with modern web technologies. Create, manage, and sell online courses with an intuitive admin panel, student dashboard, and integrated payment processing.

## ✨ Features

### 🎓 For Students
- Browse and search courses by category and level (Beginner, Intermediate, Advanced)
- Enroll in courses via Stripe-powered payments
- Track lesson progress across enrolled courses
- Access organized chapters and lessons with video content
- User dashboard to manage enrollments and progress

### 🛠️ For Admins / Instructors
- Create and manage courses with rich text descriptions (Tiptap editor)
- Organize content into chapters and lessons with drag-and-drop reordering
- Upload course thumbnails and lesson videos via AWS S3
- Set course pricing with automatic Stripe product/price creation
- Publish, archive, or draft courses
- Admin panel with analytics and data tables

### 🔐 Authentication & Security
- Email/password authentication with email verification (Gmail SMTP)
- OAuth login with **GitHub** and **Google**
- Session-based auth powered by [Better Auth](https://better-auth.com)
- Role-based access control (Admin / User)
- Route protection via Next.js middleware
- Rate limiting and bot protection with [Arcjet](https://arcjet.com)

### 💳 Payments
- Stripe integration for secure course purchases
- Webhook handling for payment confirmation
- Automatic enrollment upon successful payment

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org) (App Router, Turbopack) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4, tw-animate-css |
| **UI Components** | Radix UI, shadcn/ui, Lucide & Tabler icons |
| **Rich Text Editor** | Tiptap |
| **Forms & Validation** | React Hook Form, Zod |
| **Database** | PostgreSQL with Prisma ORM (+ Accelerate) |
| **Authentication** | Better Auth (Email, GitHub OAuth, Google OAuth) |
| **File Storage** | AWS S3 (images & videos) |
| **Payments** | Stripe |
| **Email** | Nodemailer (Gmail SMTP), React Email |
| **Security** | Arcjet (rate limiting, bot protection) |
| **Data Tables** | TanStack React Table |
| **Charts** | Recharts |
| **Drag & Drop** | dnd-kit |
| **Env Validation** | @t3-oss/env-nextjs |

## 📁 Project Structure

```
lms/
├── prisma/                  # Prisma schema & migrations
├── src/
│   ├── app/
│   │   ├── (auth)/          # Auth pages (login, register, etc.)
│   │   ├── (public)/        # Public-facing pages (course listings)
│   │   ├── admin/           # Admin panel (course/chapter/lesson management)
│   │   ├── api/             # API routes (auth, webhooks, uploads)
│   │   ├── dashboard/       # Student dashboard (enrollments, progress)
│   │   ├── payment/         # Payment & checkout pages
│   │   └── not-admin/       # Access denied page
│   ├── components/          # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities & service configs
│   │   ├── auth.ts          # Better Auth server config
│   │   ├── auth-client.ts   # Better Auth client config
│   │   ├── db.ts            # Prisma client instance
│   │   ├── stripe.ts        # Stripe client instance
│   │   ├── S3Client.ts      # AWS S3 client config
│   │   ├── arcjet.ts        # Arcjet rate limiter config
│   │   ├── mailer.ts        # Email sending logic
│   │   ├── env.ts           # Environment variable validation
│   │   └── zodSchema.ts     # Zod validation schemas
│   └── public/              # Static assets
├── middleware.ts             # Route protection middleware
├── .env.example              # Environment variable template
├── GMAIL_SETUP.md            # Gmail SMTP setup guide
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** database
- **Stripe** account
- **AWS S3** bucket (or S3-compatible storage)
- **GitHub** and/or **Google** OAuth credentials
- **Gmail** App Password (for email verification)

### 1. Clone the Repository

```bash
git clone https://github.com/Gyanranjan-Priyam/lms.git
cd lms
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Secret key for session encryption |
| `BETTER_AUTH_URL` | App URL (e.g., `http://localhost:3000`) |
| `AUTH_GITHUB_CLIENT_ID` / `AUTH_GITHUB_CLIENT_SECRET` | GitHub OAuth app credentials |
| `AUTH_GOOGLE_CLIENT_ID` / `AUTH_GOOGLE_CLIENT_SECRET` | Google OAuth app credentials |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` / `GMAIL_FROM_NAME` | Gmail SMTP config for emails |
| `ARCJET_KEY` | Arcjet API key |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | AWS credentials |
| `AWS_ENDPOINT_URL_S3` / `AWS_REGION` | S3 endpoint and region |
| `NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES` | S3 bucket name |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Stripe API keys |

> 📧 See [`GMAIL_SETUP.md`](./GMAIL_SETUP.md) for detailed Gmail App Password setup instructions.

### 4. Set Up the Database

```bash
npx prisma generate
npx prisma db push
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Create production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## 🗄️ Database Models

- **User** — Accounts with roles, profiles, and Stripe customer IDs
- **Course** — Courses with metadata, pricing, and publication status
- **Chapter** — Ordered chapters within a course
- **Lesson** — Lessons with video content within chapters
- **Enrollment** — Student-to-course enrollment records
- **LessonProgress** — Per-lesson completion tracking

## 📄 License

This project is private and not licensed for public distribution.

---

Built with ❤️ using Next.js, Prisma, Stripe, and Better Auth.