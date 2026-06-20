import typer
from rich.table import Table
from rich import box
from clutch_cli.api import get_client
from clutch_cli.theme import console, ACCENT, DIM, SUCCESS, header, footer, bar


def stats(days: int = typer.Option(30, help="Number of days to look back.")):
    """Show your GitHub activity stats."""
    with get_client() as client:
        try:
            response = client.get(f"/github/activity?days={days}")
            if response.status_code != 200:
                console.print("[bold red]Error: Failed to fetch activity data.[/bold red]")
                raise typer.Exit(1)

            data = response.json()
            commits = data["total_commits"]
            prs = data["total_prs"]
            issues = data["total_issues"]
            active = data["active_days"]

            header(f"STATS · LAST {days} DAYS")

            table = Table(box=box.SIMPLE, show_header=True, pad_edge=False)
            table.add_column("Metric", style=DIM, width=22)
            table.add_column("Count", justify="right", style="bold white", width=10)
            table.add_column("Bar", width=32)

            max_val = max(commits, prs, issues, active, 1)

            def color(val):
                return SUCCESS if val > 0 else DIM

            table.add_row("Commits", f"[{color(commits)}]{commits}[/{color(commits)}]", bar(commits, max_val))
            table.add_row("Pull Requests", f"[{color(prs)}]{prs}[/{color(prs)}]", bar(prs, max_val))
            table.add_row("Issues", f"[{color(issues)}]{issues}[/{color(issues)}]", bar(issues, max_val))
            table.add_row("Active Days", f"[{color(active)}]{active}[/{color(active)}]", bar(active, max_val))

            console.print(table)
            footer()

        except Exception:
            console.print("[bold red]Error: Could not connect to Clutch API.[/bold red]")
            raise typer.Exit(1)
