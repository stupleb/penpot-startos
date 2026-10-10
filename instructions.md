# Penpot

## Documentation

- [Penpot user guide](https://help.penpot.app/user-guide/*) — designing, prototyping, sharing, comments and teams

## What you get on StartOS

Penpot runs entirely on your server: the editor and dashboard on the **Web UI** interface, your files, comments and uploads in its own database and storage, and exports rendered on the server. Signups are off, so nobody can create an account on your Penpot unless you let them. The actions below take care of accounts and email.

## Getting set up

1. Run the **Set Admin Password** task. Copy the email (`admin@penpot.local`) and the password it shows you.
2. Run the **Set Primary URL** task and pick the address you will normally use Penpot at, for example a public domain your clients can reach. Downloads work at that address, and **Open UI** opens it.
3. Start Penpot and open the **Web UI** interface. The first start takes a minute or two while Penpot prepares its database.
4. Sign in with the email and password from step 1. You can change both under **Your account** in Penpot.
5. Optional: run **Configure SMTP** so Penpot can send invitations, comment notifications and password-reset emails.

## Sharing work with clients and collaborators

Anyone with a share link can view a prototype without an account. To leave comments they need a Penpot account on your server.

- **Share a prototype:** open the file in view mode, click **Share**, and copy the link. Under **Can comment**, choose **All Penpot users** to let anyone with an account comment, or **Only team members** to limit it to your team. Copy the link while you are on an address your client can reach.
- **Give someone an account:** run **Create or Reset Account** with their email and send them the password it shows. They can change it under **Your account**.
- **Let people sign up themselves:** run **Enable Signups**, send them the address, and run **Disable Signups** once they have registered. While signups are on, anyone who can reach Penpot can register.
- **Add someone to your team:** on your team's **Invitations** page, invite their email. Without email set up, use **Copy link** next to the invitation and send the link yourself. They need an account with that email first.

## Actions

- **Set Admin Password** — gives the administrator account a new random password. Use it if you lose the password; a running Penpot restarts to apply it.
- **Create or Reset Account** — creates an account for an email, or gives an existing account a new random password.
- **Enable Signups** / **Disable Signups** — turns self-registration on the Penpot login page on or off.
- **Set Primary URL** — chooses the address Penpot uses for downloads and email links, which is also the one **Open UI** opens.
- **Configure SMTP** — lets Penpot send email through your server's SMTP settings or another provider.

## Limitations

Downloading exports, `.penpot` files and fonts only works while you use Penpot at its primary URL, which is where **Open UI** takes you. On any other address, switch to the primary URL to download, or run **Set Primary URL** and pick the address you are on.

On a busy server, the first export after a pause can fail with an error while Penpot starts its export browser. Export again and it works.
