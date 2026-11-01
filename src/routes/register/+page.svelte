<script>
	// `form` is what the form action returned: an error message and the values typed in
	let { form } = $props();
</script>

<svelte:head>
	<title>Join the journal · Nissamåla Farm</title>
</svelte:head>

<div class="form-page">
	<form class="form-card" method="POST">
		<h1>Join the farm journal</h1>
		<p class="intro">You need an invite code from the hosts to create an account.</p>

		{#if form?.error}
			<p class="form-error" role="alert">{form.error}</p>
		{/if}

		<div class="field">
			<label for="inviteCode">Invite code</label>
			<input id="inviteCode" name="inviteCode" autocomplete="off" required />
		</div>

		<div class="field">
			<label for="username">Username</label>
			<input
				id="username"
				name="username"
				value={form?.username ?? ''}
				autocomplete="username"
				minlength="3"
				maxlength="30"
				required
			/>
			<p class="hint">Letters, numbers, - and _. You sign in with this.</p>
		</div>

		<div class="field">
			<label for="displayName">Your name</label>
			<input
				id="displayName"
				name="displayName"
				value={form?.displayName ?? ''}
				autocomplete="nickname"
				maxlength="50"
				required
			/>
			<p class="hint">Shown on your posts and comments.</p>
		</div>

		<div class="field">
			<label for="password">Password</label>
			<input
				id="password"
				name="password"
				type="password"
				autocomplete="new-password"
				minlength="8"
				maxlength="72"
				required
			/>
			<p class="hint">At least 8 characters.</p>
		</div>

		<button class="pill pill-primary">Create account</button>

		<p class="switch">Already have an account? <a href="/login">Sign in</a></p>
	</form>
</div>
