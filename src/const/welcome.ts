export const welcomeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Server Welcome</title>
	<style>
		:root {
			color-scheme: dark;
			--bg: #060b16;
			--panel: #0d1424;
			--panel-border: #1f2a44;
			--text: #e2e8f0;
			--muted: #94a3b8;
			--accent: #22d3ee;
		}

		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			min-height: 100vh;
			display: grid;
			place-items: center;
			padding: 1.5rem;
			font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
			color: var(--text);
			background:
				radial-gradient(circle at 12% 10%, rgba(8, 47, 73, 0.45), transparent 36%),
				radial-gradient(circle at 88% 90%, rgba(30, 58, 138, 0.35), transparent 42%),
				var(--bg);
		}

		main {
			width: min(92vw, 740px);
			border-radius: 20px;
			border: 1px solid var(--panel-border);
			background: linear-gradient(150deg, rgba(13, 20, 36, 0.96), rgba(6, 11, 22, 0.96));
			box-shadow: 0 18px 54px rgba(0, 0, 0, 0.5);
			padding: 2rem;
		}

		.badge {
			display: inline-block;
			border: 1px solid rgba(34, 211, 238, 0.5);
			border-radius: 999px;
			padding: 0.3rem 0.72rem;
			margin-bottom: 1rem;
			color: #67e8f9;
			background: rgba(34, 211, 238, 0.1);
			font-size: 0.8rem;
			letter-spacing: 0.04em;
		}

		h1 {
			margin: 0 0 0.65rem;
			font-size: clamp(1.6rem, 2.4vw, 2.3rem);
			line-height: 1.2;
		}

		p {
			margin: 0;
			color: var(--muted);
			line-height: 1.65;
			font-size: 1rem;
		}

		.links {
			margin-top: 1.35rem;
			display: flex;
			flex-wrap: wrap;
			gap: 0.75rem;
		}

		a {
			display: inline-block;
			text-decoration: none;
			color: var(--text);
			border: 1px solid #334155;
			background: #0f172a;
			border-radius: 10px;
			padding: 0.65rem 0.95rem;
			transition: 180ms ease;
		}

		a:hover {
			color: var(--accent);
			border-color: var(--accent);
			transform: translateY(-1px);
		}
	</style>
</head>
<body>
	<main>
		<span class="badge">API ONLINE</span>
		<h1>Welcome to the Server</h1>
		<p>
			This API is running successfully with a dark-mode landing page. Use the quick links below to
			check service health and explore versioned routes.
		</p>
		<div class="links">
			<a href="/health">Health Check</a>
		</div>
	</main>
</body>
</html>
`;
