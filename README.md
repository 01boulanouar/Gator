# Gator CLI

Gator is a command-line RSS feed aggregator.

## Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (which includes npm)
*   A running [PostgreSQL](https://www.postgresql.org/) instance.

## Setup & Configuration

1.  **Install Dependencies:**
    Navigate to the project directory and run:
    ```bash
    npm install
    ```

2.  **Database Migration:**
    Apply the database schema migrations:
    ```bash
    npm run migrate
    ```

3.  **Create Configuration File:**
    You need to create a configuration file named `.gatorconfig.json` in your home directory (`~/`).

    The file should contain the following:
    *   `dbUrl`: The connection string for your PostgreSQL database.
    *   `currentUserName`: The username of the user you want to act as. This user must be registered in the application.

    **Example `~/.gatorconfig.json`:**
    ```json
    {
      "dbUrl": "postgres://user:password@localhost:5432/gator?sslmode=disable",
      "currentUserName": "laura"
    }
    ```

## How to Run

Use the `npm start` script followed by the command you wish to execute.

```bash
npm start <command> [arguments...]
```

For example, to register a new user named "laura":
```bash
npm start register laura
```

## Available Commands

Here are some of the commands you can use with Gator:

### General Commands
*   `register <username>`: Register a new user and logs in as them.
*   `login <username>`: Log in as an existing user.
*   `users`: List all registered users.
*   `reset`: Deletes all data from the database.
*   `agg <duration>`: Starts the feed aggregator, which fetches posts from followed feeds periodically. Example duration: `10s`, `5m`, `1h`.

### Logged-In Commands
These commands require you to be "logged in" by having a valid `currentUserName` in your `~/.gatorconfig.json`.

*   `addfeed <name> <url>`: Add a new RSS feed and follow it.
*   `feeds`: List all feeds you are currently following.
*   `follow <feed_url>`: Follow an existing feed.
*   `unfollow <feed_url>`: Unfollow a feed.
*   `browse [limit]`: Browse the latest posts from your followed feeds. The optional `limit` specifies the number of posts to show (default is 2).

