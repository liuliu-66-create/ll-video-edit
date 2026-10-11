"""Copy the committed ll-video-motion library into this independent repo.

The source working tree is never read: Git blobs from --ref are used instead.
Run without --apply to inspect the planned changes.
"""

import argparse
import hashlib
import json
import subprocess
from datetime import datetime, timezone
from pathlib import Path


SHARED_DIRS = ("src/", "public/", "presets/", "template-rules/", "playground/")
SHARED_FILES = {"library.json", "DESIGN_RULES.md"}


def git(repo: Path, *args: str) -> bytes:
    result = subprocess.run(["git", "-C", str(repo), *args], capture_output=True)
    if result.returncode:
        raise RuntimeError(result.stderr.decode("utf-8", "replace").strip())
    return result.stdout


def shared(path: str) -> bool:
    return path in SHARED_FILES or path.startswith(SHARED_DIRS)


def safe_target(root: Path, relative: str) -> Path:
    target = (root / relative).resolve()
    if not target.is_relative_to(root.resolve()):
        raise ValueError(f"Path escapes motion-library: {relative}")
    return target


def source_blobs(source: Path, ref: str) -> dict[str, str]:
    entries = git(source, "ls-tree", "-rz", ref).split(b"\0")
    result = {}
    for entry in entries:
        if not entry:
            continue
        meta, raw_path = entry.split(b"\t", 1)
        mode, kind, blob = meta.decode("ascii").split()
        path = raw_path.decode("utf-8")
        if shared(path):
            if kind != "blob" or mode not in ("100644", "100755"):
                raise ValueError(f"Unsupported shared entry: {path}")
            result[path] = blob
    for required in SHARED_FILES:
        if required not in result:
            raise ValueError(f"Source is missing {required}")
    return result


def current_tracked(editor: Path) -> set[str]:
    result = set()
    for raw in git(editor, "ls-files", "-z", "--", "motion-library").split(b"\0"):
        if not raw:
            continue
        path = raw.decode("utf-8")
        if path.startswith("motion-library/"):
            relative = path[len("motion-library/"):]
            if shared(relative):
                result.add(relative)
    return result


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    editor = Path(__file__).resolve().parents[1]
    parser.add_argument("--source", type=Path, default=editor.parent / "video-motion-generator")
    parser.add_argument("--ref", default="HEAD", help="Committed source ref; uncommitted edits are excluded")
    parser.add_argument("--apply", action="store_true", help="Write the planned copy")
    args = parser.parse_args()

    source = args.source.resolve()
    destination = (editor / "motion-library").resolve()
    if not (source / ".git").exists() or not (editor / ".git").exists():
        raise RuntimeError("Both independent Git repositories must be present")
    commit = git(source, "rev-parse", f"{args.ref}^{{commit}}").decode().strip()
    dirty = git(editor, "status", "--porcelain", "--", "motion-library").decode().strip()
    if args.apply and dirty:
        raise RuntimeError("Video Edit motion-library has local changes; inspect or save them before syncing")

    blobs = source_blobs(source, args.ref)
    tracked = current_tracked(editor)
    incoming = []
    for relative, blob in blobs.items():
        target = safe_target(destination, relative)
        source_data = git(source, "cat-file", "blob", blob)
        if not target.is_file() or sha256(target.read_bytes()) != sha256(source_data):
            incoming.append((relative, source_data))
    removed = sorted(tracked - blobs.keys())
    registry = json.loads(git(source, "cat-file", "blob", blobs["library.json"]))
    local_registry_path = destination / "library.json"
    local_registry = json.loads(local_registry_path.read_text(encoding="utf-8-sig")) if local_registry_path.is_file() else {}
    local_catalog_version = local_registry.get("catalogVersion")
    incoming_catalog_version = registry.get("catalogVersion")
    catalog_conflict = bool(local_catalog_version and local_catalog_version != incoming_catalog_version)
    preview_paths = set()
    for template in registry.get("templates", []):
        for field in ("preview", "styleframe", "approvedDesign"):
            value = template.get(field)
            if isinstance(value, str) and value.startswith("previews/"):
                preview_paths.add(value)
        for field in ("variantPreviews", "variantStyleframes"):
            value = template.get(field)
            if isinstance(value, dict):
                preview_paths.update(path for path in value.values() if isinstance(path, str) and path.startswith("previews/"))
    missing_previews = sorted(path for path in preview_paths if not safe_target(destination, path).is_file())
    manifest = destination / "SOURCE_VERSION.json"
    existing_version = json.loads(manifest.read_text(encoding="utf-8-sig")) if manifest.exists() else {}
    print(json.dumps({
        "sourceCommit": commit,
        "sourceWorkingTreeDirtyIgnored": bool(git(source, "status", "--porcelain").strip()),
        "sourceFiles": len(blobs),
        "copyOrUpdate": [relative for relative, _ in incoming],
        "removeTrackedStale": removed,
        "missingGeneratedPreviews": missing_previews,
        "previousSourceCommit": existing_version.get("sourceCommit"),
        "localCatalogVersion": local_catalog_version,
        "incomingCatalogVersion": incoming_catalog_version,
        "catalogConflict": catalog_conflict,
        "mode": "apply" if args.apply else "check",
    }, ensure_ascii=False, indent=2))

    if not args.apply:
        return
    if catalog_conflict:
        raise RuntimeError("The incoming source catalog would replace Video Edit's selectable-template catalog; reconcile the catalogs before syncing")
    for relative, data in incoming:
        target = safe_target(destination, relative)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
    for relative in removed:
        safe_target(destination, relative).unlink(missing_ok=True)
    manifest.write_text(json.dumps({
        "sourceRepository": git(source, "remote", "get-url", "origin").decode().strip(),
        "sourceCommit": commit,
        "importedAtUtc": datetime.now(timezone.utc).isoformat(),
        "scope": list(SHARED_DIRS) + sorted(SHARED_FILES),
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
