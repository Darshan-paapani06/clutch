import typer
from clutch_cli import auth, streak, stats, insight, repos, patterns, status

__version__ = "0.2.0"

app = typer.Typer(
    name="clutch",
    help="GitHub tracks your work. Clutch tracks you.",
    no_args_is_help=True,
)


def _version_callback(value: bool):
    if value:
        typer.echo(f"clutch v{__version__}")
        raise typer.Exit()


@app.callback()
def main(
    version: bool = typer.Option(
        None,
        "--version",
        "-v",
        help="Show version and exit.",
        callback=_version_callback,
        is_eager=True,
    ),
):
    pass


app.add_typer(auth.app, name="auth")
app.command()(streak.streak)
app.command()(stats.stats)
app.command()(insight.insight)
app.command()(repos.repos)
app.command()(patterns.patterns)
app.command()(status.status)


if __name__ == "__main__":
    app()
