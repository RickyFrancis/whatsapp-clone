## WhatsApp Clone using Next.js and Firebase by Ricky Francis Rozario

View the app live on [WhatsApp-Clone](https://whatsapp-clone-ricky.vercel.app/).

This is a WhatsApp Clone created with [Next.js](https://nextjs.org/) and the server is [Firebase FireStore](https://firebase.google.com/)

The purpose of this project is to accomplish WhatsApp like functionalities using next.js and firebase.

## Functionalities

A user can enjoy the following functionalities currently in the app:

1. Login with Google
2. Start a new chat with another recipient by the recipient's email ID
3. Send textual messages, emojis, send images
4. All of the chats are realtime one to one communication
5. See last active of a user/recipient
6. See message sent time
7. User's and Recipient's profile picture is fetched from Google and shown as user avatar in the top left corner, in the chat list and in the current chat screen.
8. Logout

## First things first

You will need to add your own firebase api keys to your environment variable. I suggest you add them to .env.local file and you are good to go. You can add all of the environnement variables like this:

```
NEXT_PUBLIC_apiKey=YourAPIKey
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
