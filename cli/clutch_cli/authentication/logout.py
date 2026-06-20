from clutch_cli.config import clear_config, get_username
from clutch_cli.theme import console, DIM, SUCCESS, WARNING


def logout():
    """Logout from Clutch."""
    username = get_username()
    if not username:
        console.print(f"[{WARNING}]You are not logged in.[/{WARNING}]")
        raise SystemExit()

    clear_config()
    console.print(f"[{SUCCESS}]Logged out successfully.[/{SUCCESS}]")
