import typer
import webbrowser
import httpx
from rich.console import Console
from clutch_cli.config import save_token, clear_config, get_username, API_BASE_URL

app = typer.Typer(help="Authentication commands.")
console = Console()


@app.command()
def login():
    """Login to Clutch via GitHub OAuth."""
    console.print("\n[bold green]⚡ Clutch Login[/bold green]")
    console.print("Opening GitHub in your browser...\n")

    # Open GitHub OAuth in browser
    webbrowser.open(f"{API_BASE_URL}/auth/github")

    console.print("[yellow]After approving on GitHub, paste your token here:[/yellow]")
    token = typer.prompt("Token")

    # Verify token by fetching user profile
    try:
        response = httpx.get(
            f"{API_BASE_URL}/users/me",
            headers={"Authorization": f"Bearer {token}"},
            timeout=10,
        )
        if response.status_code != 200:
            console.print("[red]❌ Invalid token. Please try again.[/red]")
            raise typer.Exit(1)

        user = response.json()
        save_token(token, user["username"])
        console.print(f"\n[bold green]✅ Logged in as @{user['username']}[/bold green]")
        console.print(f"[dim]Welcome to Clutch, {user['name'] or user['username']}![/dim]\n")

    except httpx.RequestError:
        console.print("[red]❌ Could not connect to Clutch API.[/red]")
        raise typer.Exit(1)


@app.command()
def logout():
    """Logout from Clutch."""
    username = get_username()
    if not username:
        console.print("[yellow]You are not logged in.[/yellow]")
        raise typer.Exit()

    clear_config()
    console.print(f"[bold green]✅ Logged out successfully.[/bold green]")


@app.command()
def whoami():
    """Show currently logged in user."""
    username = get_username()
    if not username:
        console.print("[yellow]You are not logged in. Run: clutch auth login[/yellow]")
        raise typer.Exit()
    console.print(f"[bold green]Logged in as @{username}[/bold green]")