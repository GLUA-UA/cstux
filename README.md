# GLUA's SuperTux Tournament Dashboard

This is a landing site with a leaderboard and dashboard thant integrates with a modified version of the SuperTux game that implements functionality to make it possible to play in a tournament. 

We are using [Next.js](https://nextjs.org), [React](https://reactjs.org), [TypeScript](https://www.typescriptlang.org), [Shadcn UI](https://ui.shadcn.com/) as the library for the UI components, [Tailwind CSS](https://tailwindcss.com) for styling, and hosting on our own infrastructure.

### Development

Working locally on the project is simple. Follow the steps below to get started:

```bash
# Clone the repository
git clone https://github.com/GLUA-UA/cstux-admin-dashboard
# Navigate to the project directory
cd cstux-admin-dashboard
# Create a .env file with the necessary environment variables
echo "NEXT_PUBLIC_BASE_URL=localhost:3000" > .env
echo "NEXT_PUBLIC_DATABASE_URL="file:./data/dev.db"" > .env
echo "NEXT_PUBLIC_BASE_URL=https://localhost:3000" > .env
echo "AUTH_SECRET="hw4PDveS5+neabFfW7PrGGuAOrtci1t9ZRCEffle3VM="" > .env
# Install dependencies
bun install
# Install the database
bun run db:migrate
# Start the development server
bun run dev
```

Open the browser and visit [`http://localhost:3000`](http://localhost:3000) to see the website in action.

## Community

In case you need help, feel free to reach out using the following means:

- **Discord:** You can join our [Discord server](https://discord.com/invite/AcvtHWz) to get in touch with us.

- **E-Mail:** Contact us using [glua@ua.pt](mailto:glua@ua.pt)