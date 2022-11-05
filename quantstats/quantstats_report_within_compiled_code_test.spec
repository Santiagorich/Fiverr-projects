# -*- mode: python ; coding: utf-8 -*-



block_cipher = None


a = Analysis(
    ['quantstats_report_within_compiled_code_test.py'],
    pathex=[],
    binaries=[],
	datas = [('env/Lib/site-packages/quantstats/reports.html', 'quantstats'),('env/Lib/site-packages/quantstats/report.html', 'quantstats')],
    hiddenimports=[],
    hookspath=[],
    hooksconfig={"matplotlib": {
            "backends": "svg", 
        },},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)
pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='quantstats_report_within_compiled_code_test',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
