import typer
from rich.console import Console
from rich.table import Table
from rich import box
from clutch_cli.api import get_client

console = Console()


def stats(days: int = typer.Option(30, help="Number of days to look back.")):
    """Show your GitHub activity stats."""
    with get_client() as client:
        try:
            response = client.get(f"/github/activity?days={days}")
            if response.status_code != 200:
                console.print("[red]Error: Failed to fetch activity data.[/red]")
                raise typer.Exit(1)

            data = response.json()
            commits = data["total_commits"]
            prs = data["total_prs"]
            issues = data["total_issues"]
            active = data["active_days"]

            console.print()
            console.rule(f"[bold blue]⚡ CLUTCH — STATS · LAST {days} DAYS[/bold blue]")
            console.print()

            table = Table(box=box.SIMPLE, show_header=True, pad_edge=False)
            table.add_column("Metric", style="dim", width=22)
            table.add_column("Count", justify="right", style="bold white", width=10)
            table.add_column("Bar", width=32)

            max_val = max(commits, prs, issues, active, 1)

            def bar(val):
                filled = int((val / max_val) * 28)
                return f"[blue]{'█' * filled}[/blue][dim]{'░' * (28 - filled)}[/dim]"

            def color(val):
                return "bold green" if val > 0 else "dim"

            table.add_row("Commits", f"[{color(commits)}]{commits}[/{color(commits)}]", bar(commits))
            table.add_row("Pull Requests", f"[{color(prs)}]{prs}[/{color(prs)}]", bar(prs))
            table.add_row("Issues", f"[{color(issues)}]{issues}[/{color(issues)}]", bar(issues))
            table.add_row("Active Days", f"[{color(active)}]{active}[/{color(active)}]", bar(active))

            console.print(table)
            console.print()
            console.rule(style="dim")
            console.print()

        except Exception:
            console.print("[red]Error: Could not connect to Clutch API.[/red]")
            raise typer.Exit(1)
