# Mashaweer-Go - Getting Started Guide

This guide will help you download and run the Mashaweer-Go admin dashboard on your computer.

## What You Need Before Starting

Make sure you have these programs installed on your computer:

1. Node.js (version 18 or higher)
   - Download from: https://nodejs.org/
   - Choose the LTS (Long Term Support) version
   - After installing, open Command Prompt and type: node --version
   - You should see a version number like v18.0.0 or higher

2. Git
   - Download from: https://git-scm.com/
   - After installing, open Command Prompt and type: git --version
   - You should see a version number

3. A code editor (optional but recommended)
   - VS Code is free and easy to use: https://code.visualstudio.com/

## Step 1: Download the Code

Open Command Prompt (or Terminal) and follow these steps:

1. Navigate to where you want to save the project:
```
cd Desktop
```

2. Download the code from GitHub:
```
git clone https://github.com/your-username/Mashaweer-Go.git
```

3. Go into the project folder:
```
cd Mashaweer-Go
cd admin
```

## Step 2: Install Dependencies

Dependencies are the libraries and packages that the project needs to work.

Run this command:
```
npm install
```

This will take a few minutes. You will see a lot of text scrolling by - this is normal.

## Step 3: Set Up Environment Variables

Environment variables are settings that tell the app how to connect to the database.

1. In the admin folder, create a new file called .env.local

2. Open the file and add these two lines:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key-here
```

3. Replace the placeholder text with your actual Supabase credentials:
   - Log in to https://supabase.com/
   - Go to your project settings
   - Click on "API" in the sidebar
   - Copy the "Project URL" and paste it after the equals sign on the first line
   - Copy the "anon public" key and paste it after the equals sign on the second line

4. Save the file

## Step 4: Run the Application

In Command Prompt (make sure you are still in the admin folder), run:
```
npm run dev
```

Wait a few seconds. You should see a message like:
```
Ready on http://localhost:3000
```

## Step 5: View the Application

Open your web browser and go to:
```
http://localhost:3000
```

You should now see the Mashaweer-Go admin dashboard.

## Stopping the Application

To stop the application, go back to Command Prompt and press:
```
Ctrl + C
```

Then type Y and press Enter.

## Getting Updates

If the code gets updated, you can download the latest changes:

1. Open Command Prompt
2. Navigate to the project folder:
```
cd Desktop/Mashaweer-Go/admin
```

3. Download the latest changes:
```
git pull
```

4. Install any new dependencies:
```
npm install
```

5. Start the app again:
```
npm run dev
```

## Common Problems and Solutions

### Problem: Port 3000 is already in use
**Solution**: Another program is using port 3000. Either close that program or change the port by running:
```
npm run dev -- -p 3001
```
Then open http://localhost:3001 instead.

### Problem: npm install fails
**Solution**: Try these commands one at a time:
```
npm cache clean --force
npm install
```

### Problem: Cannot connect to database
**Solution**: Check your .env.local file and make sure:
- The file is in the admin folder
- The Supabase URL and key are correct
- There are no extra spaces or quotation marks

### Problem: Command not found
**Solution**: Make sure Node.js and Git are properly installed. Restart Command Prompt and try again.

## Need Help?

If you run into problems:
1. Make sure you followed each step exactly
2. Check that Node.js and Git are installed correctly
3. Make sure you are in the admin folder when running commands
4. Try restarting Command Prompt and your computer

## Summary of Commands

Here is a quick reference of all the commands you need:

```
# Download the code (only needed once)
git clone https://github.com/your-username/Mashaweer-Go.git
cd Mashaweer-Go/admin

# Install dependencies (only needed once, or after updates)
npm install

# Run the application
npm run dev

# Get updates
git pull
npm install

# Stop the application
Ctrl + C
```

That is it! You are now ready to use the Mashaweer-Go admin dashboard.
