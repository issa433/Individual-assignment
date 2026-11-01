<script>
	// `form` is what the form action returned: an error message and the username typed in
	let { form } = $props();
</script>

<svelte:head>
	<title>Sign in · Nissamåla Farm</title>
</svelte:head>

<div class="form-page">
	<form class="form-card" method="POST">
		<h1>Welcome back!</h1>
		<p class="intro">Sign in to write posts and comments.</p>

		{#if form?.error}
			<p class="form-error" role="alert">{form.error}</p>
		{/if}

		<div class="field">
			<label for="username">Username</label>
			<input id="username" name="username" value={form?.username ?? ''} autocomplete="username" required />
		</div>

		<div class="field">
			<label for="password">Password</label>
			<input id="password" name="password" type="password" autocomplete="current-password" required />
		</div>

		<button class="pill pill-primary">Sign in</button>

		<p class="switch">New here? <a href="/register">Create an account</a> with your invite code.</p>
	</form>
</div>
