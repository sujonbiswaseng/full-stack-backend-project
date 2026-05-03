
### Project name : 
##### lumen – Event Management Platform 

### Project description : 
##### Lumen is a high-performance, full-stack event management ecosystem engineered for the modern era. It serves as a comprehensive bridge between ambitious event organizers and global audiences. From high-capacity music festivals to intimate corporate seminars, Lumen provides a professional-grade suite of tools for event discovery, secure ticketing, and real-time participant management.

Built with a focus on scalability, security, and intelligence, Lumen eliminates the friction of traditional planning by integrating AI-driven insights and a flawless, role-based user experience.

### Quick Links
 - Frontend Repo    : https://github.com/sujonbiswaseng/lumen-frontend-project.git
- Backend Repo     : https://github.com/sujonbiswaseng/full-stack-backend-project.git
- Frontend Live    : https://lumen-frontend-project.vercel.app
- Backend Live     : https://full-stack-backend-project-taupe.vercel.app

### Key feature
Authentication
- User registration and login
- Secure authentication using JWT
- Protected routes
- Google social login

📅 Event Management
- Create, update, and delete events
- View event details
- Support for public and private events

🛠️ Event Control
- Approve or reject requests
- View participants
- Ban users
- Edit and delete events

🔍 Search & Filter

👥 Participation
- Public Free → Join instantly
- Public Paid → Pay & join
- Private Free → Request to join
- Private Paid → Pay & request

💳 Payment
- Payment required for paid events
- Secure payment integration
- Requests stay pending after payment

📨 Invitations
- Hosts can invite users
- Accept or decline invitations
- Pay & accept for paid events

⭐ Reviews
- Add, edit, and delete reviews
- Rate events

⚠️ Error Handling
- Form validation
- Clear error messages
- Loading states 
🎨 UI/UX
- Responsive design
- Clean layout
- Easy to use

### 🛠️ Technology Stack
Frontend
- Next.js
- Tailwind CSS
- shadcn

Backend
- Node.js
- Express.js
- Prisma ORM
Database
- PostgreSQL
Authentication
- JWT
- Better-Auth
Payment
 - Stripe

Deployment
- Vercel (Frontend)
- vercel(Backend)

## Setup Instructions
- (frontend) : git clone https://github.com/sujonbiswaseng/lumen-frontend-project.git
- (backend) : git clone https://github.com/sujonbiswaseng/full-stack-backend-project.git

### Backend Setup
- cd full-stack-backend-project.git
- pnpm install
- Create .env file:
```typescript
DATABASE_URL='postgresql://username:password@localhost:5432/mydatabase?schema=public'

BETTER_AUTH_SECRET=your_super_secret_key_here
BETTER_AUTH_URL=http://localhost:5000

FRONTEND_URL=http://localhost:3000
PORT=5000
NODE_ENV=development

ACCESS_TOKEN_SECRET=access_token_secret_example
REFRESH_TOKEN_SECRET=refresh_token_secret_example
ACCESS_TOKEN_EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=7d

GITHUB_CLIENT_ID=github_client_id_example
GITHUB_CLIENT_SECRET=github_client_secret_example

CLOUDINARY_CLOUD_NAME=cloud_name_example
CLOUDINARY_API_KEY=cloudinary_api_key_example
CLOUDINARY_API_SECRET=cloudinary_api_secret_example

GOOGLE_CLIENT_ID=google_client_id_example
GOOGLE_CLIENT_SECRET=google_client_secret_example
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/callback/google

STRIPE_SECRET_KEY=sk_test_example_key
STRIPE_WEBHOOK_SECRET=whsec_example_secret

RESEND_API_KEY=resend_api_key_example

EMAIL_SENDER_SMTP_USER=example@gmail.com
EMAIL_SENDER_SMTP_PASS=app_password_here
EMAIL_SENDER_SMTP_HOST=smtp.gmail.com
EMAIL_SENDER_SMTP_PORT=465
EMAIL_SENDER_SMTP_FROM=example@gmail.com
```

Run the cmd:
- pnpm dlx prisma migrate reset
- pnpm dlx prisma migrate dev

- pnpm dlx prisma generate
- pnpm dev

### Frontend Setup

- cd lumen-frontend-project.git
- pnpm install
- Create .env file:

```typescript

NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:5000

 ACCESS_TOKEN_SECRET=accesssecret
 REFRESH_TOKEN_SECRET=refreshsecret
```
pnpm dev
