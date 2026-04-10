
### Project name : 
##### Planora – Event Management Platform 

### Project description : 
##### Planora is a high-performance, full-stack event management platform designed to bridge the gap between event organizers and attendees. Whether it’s a public concert or a private corporate workshop, Planora provides a seamless workflow for event creation, secure payments, and role-based participant management.

### Quick Links
 - Frontend Repo    : https://github.com/sujonbiswasdev/frontend-nextlevel-assignment-5.git
- Backend Repo     : https://github.com/sujonbiswasdev/nextlevel-backend-assignment-5.git
- Frontend Live    : https://project-frontend.vercel.app
- Backend Live     : https://nextlevel-backend-assignment-5.vercel.app

- Demo Video       : https://frontend-nextlevel-assignment-5.vercel.app


### Key feature
Authentication
- User registration and login
- Secure authentication using JWT
- Protected routes

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
Payment
 - Stripe

Deployment
- Vercel (Frontend)
- vercel(Backend)

## Setup Instructions
- (frontend) : git clone https://github.com/sujonbiswasdev/frontend-nextlevel-assignment-5.git
- (backend) : git clone https://github.com/sujonbiswasdev/nextlevel-backend-assignment-5.git

### Backend Setup
- cd nextlevel-backend-assignment-5
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

- cd frontend-nextlevel-assignment-5
- pnpm install
- Create .env file:

```typescript

NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:5000

 ACCESS_TOKEN_SECRET=accesssecret
 REFRESH_TOKEN_SECRET=refreshsecret
 
```

pnpm dev