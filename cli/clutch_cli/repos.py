import typer
from rich.console import Console
from rich.table import Table
from rich import box
from clutch_cli.api import get_client

console = Console()

LANG_COLORS = {
    "Python": "blue",
    "TypeScript": "cyan",
    "JavaScript": "yellow",
    "Go": "cyan",
    "Rust": "red",
    "Java": "red",
    "C++": "blue",
    "C": "blue",
    "Shell": "green",
    "HTML": "red",
    "CSS": "blue",
}


def repos():
    """Show your most recently active repositories."""
    with get_client() as client:
        try:
            response = client.get("/github/repos")
            if response.status_code != 200:
                console.print("[red]Error: Failed to fetch repositories.[/red]")
                raise typer.Exit(1)

            repos_data = response.json()

            console.print()
            console.rule("[bold blue]⚡ CLUTCH — REPOSITORIES[/bold blue]")
            console.print()

            table = Table(box=box.SIMPLE, show_header=True, pad_edge=False)
            table.add_column("Repository", style="bold white", width=28)
            table.add_column("Language", width=14)
            table.add_column("Stars", justify="right", width=7)
            table.add_column("Forks", justify="right", width=7)
            table.add_column("Updated", style="dim", width=12)

            for repo in repos_data[:10]:
                lang = repo.get("language") or "—"
                lang_color = LANG_COLORS.get(lang, "white")
                stars = repo.get("stargazers_count", 0)
                forks = repo.get("forks_count", 0)

                table.add_row(
                    repo["name"],
                    f"[{lang_color}]{lang}[/{lang_color}]",
                    f"[yellow]{stars}[/yellow]" if stars > 0 else "[dim]0[/dim]",
                    str(forks) if forks > 0 else "[dim]0[/dim]",
                    repo["updated_at"][:10],
                )

            console.print(table)
            console.print()
            console.rule(style="dim")
            console.print()

        except Exception:
            console.print("[red]Error: Could not connect to Clutch API.[/red]")
            raise typer.Exit(1)
