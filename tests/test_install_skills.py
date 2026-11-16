from pathlib import Path
import importlib.util
import tempfile
import unittest

spec = importlib.util.spec_from_file_location(
    "installer", Path(__file__).resolve().parents[1] / "install-skills.py")
installer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(installer)


class InstallTest(unittest.TestCase):
    def test_backup_idempotence_and_unrelated_file(self):
        with tempfile.TemporaryDirectory() as root:
            path = Path(root)
            source, destination = path / "source", path / "installed"
            (source / "example").mkdir(parents=True)
            skill = source / "example/SKILL.md"
            skill.write_text("first")
            self.assertEqual(installer.install(source, destination, ["example"])["status"], "different")
            self.assertFalse(destination.exists())
            self.assertEqual(installer.install(source, destination, ["example"], True)["status"], "matched")
            (destination / "example/local.txt").write_text("keep")
            skill.write_text("second")
            result = installer.install(source, destination, ["example"], True)
            self.assertEqual((Path(result["backup"]) / "example/SKILL.md").read_text(), "first")
            self.assertEqual((destination / "example/local.txt").read_text(), "keep")
            self.assertEqual(installer.install(source, destination, ["example"], True)["changed"], [])

    def test_symlink_and_traversal_rejected(self):
        with tempfile.TemporaryDirectory() as root:
            path = Path(root)
            source, destination = path / "source", path / "installed"
            (source / "example").mkdir(parents=True)
            (source / "example/SKILL.md").write_text("example")
            destination.mkdir()
            (destination / "example").symlink_to(source / "example")
            with self.assertRaises(ValueError):
                installer.install(source, destination, ["example"], True)
            with self.assertRaises(ValueError):
                installer.install(source, destination, ["../example"], True)


if __name__ == "__main__":
    unittest.main()
