# HF Social
HF Social is a full-stack content management platform designed to help businesses and individuals maintain a consistent, high-quality social media presence across Twitter, LinkedIn, and Instagram. It leverages a context-aware AI chatbot to accelerate content creation and uses a robust scheduling worker to ensure reliable, compliant automatic publishing.

The platform was built to meet the Humanity Founders Full Stack Challenge objectives by seamlessly integrating content generation, calendar scheduling, and posting automation into one simple interface.
Key Features and Compliance
1. Context-Aware AI Chatbot (Content Generation)
Our AI model goes beyond generic output by retaining and utilizing a business context profile (industry, voice, audience). This allows it to generate content that is personalized, relevant, and avoids sounding "too AI-generated," focusing on a genuine tone as requested.

Generation Types: Supports drafting text-only posts, and posts requiring image/video captions.

2. Full-Stack Scheduling & Calendar
The platform provides a single calendar interface for viewing and managing all scheduled posts across multiple platforms.

Post Status Visuals: Posts are clearly color-coded on the calendar based on status (Draft, Scheduled, Published, Failed).

Editing Gateway: Users can select any scheduled post to access the Review and Edit Modal, fulfilling the requirement to modify content before publication.

Post Types: Supports marking posts as Dynamic (prompting engagement) or Static (visual content).

3. Reliable Posting Automation (The Worker Service)
A dedicated, independent Node-Cron worker runs in the backend to ensure posts are published precisely at the scheduled time.

Compliance: The system uses a dedicated Social Media Service Layer to isolate API calls, ensuring platform guidelines are followed and rate limits are respected to prevent account bans.

Reliability: The worker marks posts as Published only after confirming API success on the target platform, and marks them Failed if a posting attempt is unsuccessful.

⚙️ Tech Stack
Component	Technology Used	Rationale / Integration
Backend	Node.js (Express)	Used for building scalable API routes, managing sessions, and running the Cron Worker.
AI Integration	Google Gen AI (Gemini API)	Chosen for its strong performance in context-aware, non-generic content generation.
Frontend	React / Next.js	Provides a modern, component-based architecture for a clean and responsive UI/UX.
Database	MongoDB / Mongoose	Flexible NoSQL database used to store Scheduled Posts, User Accounts, and Social Access Tokens.
Scheduling	node-cron / react-big-calendar	Core libraries for backend job scheduling and frontend calendar visualization.

Export to Sheets
🔒 Setup and Usage
Prerequisites
Node.js (v18+) and npm installed.

MongoDB instance running (Local or Atlas).

API Keys: Obtain keys for the following services:

Gemini API Key (for content generation)

Twitter/X, LinkedIn, and Instagram Developer Credentials (for posting)

Getting Started
Clone the Repository:https://github.com/BhaviReddyy/hf-social/

Bash

git clone 
cd hf-social
Install Dependencies:

Bash

cd backend && npm install
cd ../frontend && npm install
Environment Configuration:
Create a .env file in the backend directory and define your variables (e.g., GEMINI_API_KEY, MONGO_URI, TWITTER_CLIENT_ID, etc.).

Run the Application:

Bash

# Start Backend (API routes and Cron Worker)
cd backend && npm start 
# Start Frontend
cd ../frontend && npm run dev
The application will be accessible at http://localhost:3000. Begin by linking your social accounts on the Settings page and interacting with the Chatbot to generate your first draft!
