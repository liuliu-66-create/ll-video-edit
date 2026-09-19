import unittest
from pathlib import Path
import json
import os
import subprocess
import sys
import tempfile
from check_template_usage import audit, markdown

LIB = {"templates": [
    {"id":"zigzag","name":"折线","composition":"Z","status":"validated","family":"flow","layoutPattern":"zig"},
    {"id":"journey","composition":"J","status":"validated","family":"flow","layoutPattern":"journey"},
    {"id":"timeline","composition":"T","status":"validated","family":"time","layoutPattern":"axis"},
    {"id":"draft","composition":"D","status":"candidate","family":"draft","layoutPattern":"draft"}
]}
def use(t="zigzag", c="Z"):
    return {"templateId":t,"composition":c}
def shot(sid, *uses):
    return {"id":sid,"kind":"library" if uses else "other","uses":list(uses)}
def check(*shots):
    return audit({"shots":list(shots)}, LIB)

class UsageTests(unittest.TestCase):
    def test_cli_exit_codes_and_markdown(self):
        with tempfile.TemporaryDirectory() as tmp:
            folder=Path(tmp)
            registry=folder/"library.json"
            plan=folder/"plan.json"
            registry.write_text(json.dumps(LIB),encoding="utf-8")
            for shots, expected in [
                ([shot("1",use())],0),
                ([shot("1",use()),shot("2",use())],1),
                ([shot("1",use("missing","M"))],2),
            ]:
                plan.write_text(json.dumps({"shots":shots}),encoding="utf-8")
                run=subprocess.run([sys.executable,str(Path(__file__).with_name("check_template_usage.py")),
                    "--plan",str(plan),"--library",str(registry)],capture_output=True,text=True,
                    encoding="utf-8",errors="replace",env={**os.environ,"PYTHONUTF8":"1"})
                self.assertEqual(run.returncode,expected,run.stdout+run.stderr)
                if expected != 2:
                    self.assertIn("全片总次数",run.stdout)
    def test_nth_total_and_nonlibrary_break(self):
        r=check(shot("1",use()),shot("2"),shot("3",use()))
        self.assertEqual(r["issues"], [])
        self.assertEqual(r["rows"][2]["nth"],2)
        self.assertEqual(r["counts"]["template"]["zigzag / Z"],2)
        self.assertIn("具体动效汇总",markdown(r))
    def test_variant_family_merge(self):
        r=check(shot("1",use()),shot("2",use("journey","J")))
        self.assertEqual(r["counts"]["family"]["flow"],2)
        self.assertTrue(any("相邻" in x for x in r["issues"]))
    def test_family_limit_across_variants(self):
        r=check(shot("1",use()),shot("2"),shot("3",use("journey","J")),shot("4"),
                shot("5",use()),shot("6"),shot("7",use("journey","J")))
        self.assertEqual(r["counts"]["family"]["flow"],4)
        self.assertTrue(any("超过3次" in x for x in r["issues"]))
    def test_same_shot_repeated_calls_and_layout_limit(self):
        r=check(shot("1",use(),use(),use()))
        self.assertEqual(r["counts"]["template"]["zigzag / Z"],3)
        self.assertTrue(any("超过2次" in x for x in r["issues"]))
    def test_unknown_candidate_and_forged_family_rejected(self):
        for value in [use("draft","D"),use("missing","M"),{**use(),"family":"fake"}]:
            with self.assertRaises(ValueError):
                check(shot("1",value))
    def test_missing_uses_duplicate_and_empty_rejected(self):
        for shots in [[],[{"id":"1","kind":"library"}],[shot("1"),shot("1")]]:
            with self.assertRaises(ValueError):
                audit({"shots":shots},LIB)
    def test_zero_use_report(self):
        r=check(shot("1"),shot("2"))
        self.assertFalse(r["issues"])
        self.assertIn("无素材库动效",markdown(r))
    def test_real_registry(self):
        path=Path(__file__).resolve().parents[3]/"motion-library"/"library.json"
        if not path.exists():
            self.skipTest("packaged repository test only")
        lib=json.loads(path.read_text(encoding="utf-8-sig"))
        r=audit({"shots":[shot("1",use("process-flow-zigzag","ProcessFlowZigzag")),
                         shot("2",use("opposing-trends","OpposingTrends")),
                         shot("3",use("process-flow-journey","ProcessFlowJourney"))]},lib)
        self.assertEqual(r["counts"]["family"]["process-flow"],2)
        self.assertEqual(r["issues"],[])

if __name__ == "__main__":
    unittest.main()
