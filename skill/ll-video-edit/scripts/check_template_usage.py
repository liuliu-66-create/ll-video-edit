"""Count storyboard library uses against the real registry. No third-party dependencies."""
import argparse
import json
from collections import Counter, defaultdict
from pathlib import Path


def catalogue(library):
    result = {}
    def visit(node, parent, template_id, template_name):
        if not isinstance(node, dict):
            return
        status = node.get("status", parent.get("status"))
        metadata = {**parent, **{k: node[k] for k in ("family", "layoutPattern") if k in node}, "status": status}
        if "composition" in node and status == "validated":
            key = (template_id, node["composition"])
            if not metadata.get("family") or not metadata.get("layoutPattern"):
                raise ValueError(f"{key}: registry lacks family/layoutPattern")
            result[key] = {**metadata, "name": template_name}
        for value in node.values():
            if isinstance(value, dict):
                visit(value, metadata, template_id, template_name)
    for template in library["templates"]:
        visit(template, {}, template["id"], template.get("name", template["id"]))
    return result


def audit(plan, library):
    entries = catalogue(library)
    shots = plan.get("shots")
    if not isinstance(shots, list) or not shots:
        raise ValueError("shots must be a non-empty chronological list")
    policy = library.get("selectionPolicy", {})
    limits = {"family": policy.get("maxUsesPerFamily", 3), "layout": policy.get("maxUsesPerLayout", 2)}
    for value in limits.values():
        if type(value) is not int or value < 1:
            raise ValueError("Invalid registry repetition limit")
    counts = {key: Counter() for key in ("template", "family", "layout")}
    locations = {key: defaultdict(list) for key in counts}
    rows, issues, ids, previous = [], [], set(), set()
    for shot in shots:
        sid = shot.get("id")
        if not isinstance(sid, str) or not sid.strip() or sid in ids:
            raise ValueError("Every shot needs a unique non-empty string id")
        ids.add(sid)
        kind, uses = shot.get("kind"), shot.get("uses")
        if kind not in ("library", "other") or not isinstance(uses, list):
            raise ValueError(f"{sid}: require kind library/other and explicit uses list")
        if (kind == "library" and not uses) or (kind == "other" and uses):
            raise ValueError(f"{sid}: kind and uses conflict")
        current = set()
        for index, use in enumerate(uses, 1):
            if not isinstance(use, dict):
                raise ValueError(f"{sid}: invalid use")
            key = (use.get("templateId"), use.get("composition"))
            if key not in entries:
                raise ValueError(f"{sid}: unknown or unvalidated template/composition {key}")
            info = entries[key]
            for field in ("family", "layoutPattern"):
                if field in use and use[field] != info[field]:
                    raise ValueError(f"{sid}: {field} differs from registry")
            keys = {"template": " / ".join(key), "family": info["family"], "layout": info["layoutPattern"]}
            location = f"{sid}#{index}"
            for category, value in keys.items():
                counts[category][value] += 1
                locations[category][value].append(location)
            current.add(info["family"])
            rows.append({"shot": location, "name": info["name"], **keys,
                         "nth": counts["template"][keys["template"]]})
        if not uses:
            rows.append({"shot": sid, "name": "非素材库画面", "template": "—", "family": "—", "layout": "—", "nth": "—"})
        if not policy.get("allowAdjacentSameFamily", False):
            for family in sorted(previous & current):
                issues.append(f"相邻镜头 {previous_id} → {sid} 重复家族 {family}")
        previous, previous_id = current, sid
    for category, limit in limits.items():
        for value, count in counts[category].items():
            if count > limit:
                issues.append(f"{category} {value}: {count}次，超过{limit}次；镜头 {', '.join(locations[category][value])}")
    return {"rows": rows, "counts": counts, "locations": locations, "issues": issues, "limits": limits}


def markdown(report):
    def clean(value):
        return str(value).replace("|", "\\|").replace("\n", " ")
    lines = ["# 分镜动效使用统计", "",
             "结果：" + ("未通过，调整分镜后重新检查。" if report["issues"] else "次数与相邻重复检查通过；仍需人工检查语义匹配。"), "",
             "| 镜头/调用 | 模板名称 | 模板ID / 具体变体（Composition） | 家族 | 构图 | 本片第几次 | 全片总次数 |",
             "|---|---|---|---|---|---:|---:|"]
    for row in report["rows"]:
        total = report["counts"]["template"].get(row["template"], "—")
        values = [row["shot"], row["name"], row["template"], row["family"], row["layout"], row["nth"], total]
        lines.append("| " + " | ".join(map(clean, values)) + " |")
    for category, label in (("template", "具体动效"), ("family", "模板家族"), ("layout", "构图")):
        lines += ["", "## " + label + "汇总", "", "| 名称 | 次数 | 对应镜头/调用 | 状态 |", "|---|---:|---|---|"]
        for value, count in report["counts"][category].items():
            limit = report["limits"].get(category)
            state = "超限" if limit and count > limit else ("通过" if limit else "按家族及构图规则检查")
            lines.append("| " + " | ".join(map(clean, [value, count, ", ".join(report["locations"][category][value]), state])) + " |")
        if not report["counts"][category]:
            lines.append("| 无素材库动效 | 0 | — | — |")
    lines += ["", "## 问题", ""]
    lines += ["- " + issue for issue in report["issues"]] or ["- 无次数超限或相邻重复。"]
    return "\n".join(lines) + "\n"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--plan", required=True)
    parser.add_argument("--library", required=True)
    parser.add_argument("--out", help="New report path; refuses to overwrite existing files")
    args = parser.parse_args()
    try:
        plan = json.loads(Path(args.plan).read_text(encoding="utf-8-sig"))
        library = json.loads(Path(args.library).read_text(encoding="utf-8-sig"))
        result = audit(plan, library)
        report = markdown(result)
        if args.out:
            with Path(args.out).open("x", encoding="utf-8") as stream:
                stream.write(report)
        print(report)
        return 1 if result["issues"] else 0
    except (ValueError, KeyError, TypeError, AttributeError, OSError) as error:
        print(f"统计失败（不可视为通过）：{error}")
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
