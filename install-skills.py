#!/usr/bin/env python3
"""Install selected skills without deleting local files; back up replacements."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import tempfile
from datetime import datetime, timezone


def install(source, destination, names, apply=False):
    files = []
    for name in names:
        if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', name):
            raise ValueError(f'Invalid skill name: {name}')
        directory = source / name
        if not (directory / 'SKILL.md').is_file():
            raise ValueError(f'Skill not found: {name}')
        if (destination / name).is_symlink():
            raise ValueError(f'Refusing to replace symlinked skill: {name}')
        for path in sorted(directory.rglob('*')):
            if any(p in {'node_modules', '.git', '__pycache__'} for p in path.parts):
                continue
            if path.is_symlink():
                raise ValueError(f'Symlink in source: {path}')
            if path.is_file():
                relative = path.relative_to(source)
                target = destination / relative
                if any(p.is_symlink() for p in [target, *target.parents]):
                    raise ValueError(f'Symlink in destination: {target}')
                files.append((path, target, relative))
    changed = [(p, t, r) for p, t, r in files if not t.is_file() or p.read_bytes() != t.read_bytes()]
    backup = None
    if apply and changed:
        backup = destination.parent / '.skill-backups' / datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S.%fZ')
        for source_file, target, relative in changed:
            if target.exists():
                saved = backup / relative
                saved.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(target, saved)
            target.parent.mkdir(parents=True, exist_ok=True)
            fd, temporary = tempfile.mkstemp(dir=target.parent, prefix='.install-')
            try:
                with os.fdopen(fd, 'wb') as stream:
                    stream.write(source_file.read_bytes())
                shutil.copymode(source_file, temporary)
                os.replace(temporary, target)
            finally:
                if os.path.exists(temporary):
                    os.unlink(temporary)
    matches = all(t.is_file() and p.read_bytes() == t.read_bytes() for p, t, _ in files)
    return {'status': 'matched' if matches else 'different', 'changed': [str(r) for _, _, r in changed],
            'backup': str(backup) if backup and backup.exists() else None,
            'files': {str(r): hashlib.sha256(p.read_bytes()).hexdigest() for p, _, r in files}}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('skills', nargs='+', help='Explicit skill names to install')
    parser.add_argument('--source', type=Path, default=Path(__file__).resolve().parent / 'skills')
    parser.add_argument('--destination', type=Path, default=Path.home() / '.agents/skills')
    parser.add_argument('--apply', action='store_true', help='Apply changes; default is a read-only hash check')
    args = parser.parse_args()
    try:
        result = install(args.source, args.destination, args.skills, args.apply)
    except (ValueError, OSError) as error:
        parser.exit(2, f'{error}\n')
    print(json.dumps(result, indent=2))
    return 0 if result['status'] == 'matched' else 1


if __name__ == '__main__':
    raise SystemExit(main())
