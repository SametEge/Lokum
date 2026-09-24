; This Source Code Form is subject to the terms of the Mozilla Public
; License, v. 2.0. If a copy of the MPL was not distributed with this
; file, You can obtain one at http://mozilla.org/MPL/2.0/.
;
; Lokum installer (NSIS 3, Unicode).
;
; Per-user install into %LOCALAPPDATA%\Programs\Lokum: no administrator
; rights are needed, which lets the built-in updater install new versions
; silently in the background.
;
; Build (done by scripts/build.py):
;   makensis -DVERSION=1.2.3 -DVERSION_NUMERIC=1.2.3.0 -DFIREFOX_VERSION=156.0
;            -DAPP_DIR=<prepared Lokum dir> -DOUTFILE=<setup.exe> installer/lokum.nsi
;
; Command line:
;   /S                silent install
;   /UPDATE           update an existing install (used by the auto-updater)
;   /PID=<n>          wait for this Lokum process to exit before copying
;   /RELAUNCH         start Lokum when done
;   /DESKTOP=0|1      desktop shortcut (default 1)
;   /D=<dir>          install directory (must be last)

Unicode true
ManifestDPIAware true
ManifestSupportedOS Win10
RequestExecutionLevel user
SetCompressor /SOLID lzma
SetCompressorDictSize 64
SetDatablockOptimize on
CRCCheck on
XPStyle on

!ifndef VERSION
  !define VERSION "0.0.0-dev"
!endif
!ifndef VERSION_NUMERIC
  !define VERSION_NUMERIC "0.0.0.0"
!endif
!ifndef FIREFOX_VERSION
  !define FIREFOX_VERSION "unknown"
!endif
!ifndef APP_DIR
  !error "APP_DIR must point to the prepared Lokum directory"
!endif
!ifndef OUTFILE
  !define OUTFILE "Lokum-Setup-${VERSION}.exe"
!endif
!ifndef ARCH
  !define ARCH "x64"
!endif

!define APP_NAME "Lokum"
!define APP_EXE "lokum.exe"
!define PUBLISHER "Lokum Project"
!define AUMID "Lokum.Browser"
!define WEBSITE "https://github.com/SametEge/Lokum"
!define UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\Lokum"
!define LOKUM_KEY "Software\Lokum"
!define ASSETS "${__FILEDIR__}/../branding/generated"

Name "${APP_NAME}"
OutFile "${OUTFILE}"
InstallDir "$LOCALAPPDATA\Programs\Lokum"
InstallDirRegKey HKCU "${LOKUM_KEY}" "InstallDir"
BrandingText "Lokum ${VERSION} · Firefox ${FIREFOX_VERSION}"
ShowInstDetails nevershow
ShowUninstDetails nevershow

VIProductVersion "${VERSION_NUMERIC}"
VIAddVersionKey /LANG=0 "ProductName" "${APP_NAME}"
VIAddVersionKey /LANG=0 "CompanyName" "${PUBLISHER}"
VIAddVersionKey /LANG=0 "FileDescription" "${APP_NAME} Setup"
VIAddVersionKey /LANG=0 "FileVersion" "${VERSION}"
VIAddVersionKey /LANG=0 "ProductVersion" "${VERSION}"
VIAddVersionKey /LANG=0 "LegalCopyright" "Lokum contributors · MPL 2.0"

!include "MUI2.nsh"
!include "LogicLib.nsh"
!include "FileFunc.nsh"
!include "WinVer.nsh"
!include "nsDialogs.nsh"
!include "x64.nsh"
!include "TextFunc.nsh"
!insertmacro TrimNewLines
!insertmacro un.TrimNewLines

; --------------------------------------------------------------- appearance
!define MUI_ICON "${ASSETS}/lokum.ico"
!define MUI_UNICON "${ASSETS}/lokum.ico"
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_RIGHT
!define MUI_HEADERIMAGE_BITMAP "${ASSETS}/installer/header.bmp"
!define MUI_HEADERIMAGE_UNBITMAP "${ASSETS}/installer/header.bmp"
!define MUI_WELCOMEFINISHPAGE_BITMAP "${ASSETS}/installer/wizard.bmp"
!define MUI_UNWELCOMEFINISHPAGE_BITMAP "${ASSETS}/installer/wizard.bmp"
!define MUI_BGCOLOR "FFFFFF"
!define MUI_TEXTCOLOR "4A1730"
!define MUI_ABORTWARNING
!define MUI_LANGDLL_ALLLANGUAGES
!define MUI_LANGDLL_REGISTRY_ROOT HKCU
!define MUI_LANGDLL_REGISTRY_KEY "${LOKUM_KEY}"
!define MUI_LANGDLL_REGISTRY_VALUENAME "InstallerLanguage"
!define MUI_FINISHPAGE_NOAUTOCLOSE

Var WantDesktop
Var DesktopCheckbox
Var DefaultCheckbox
Var MakeDefault
Var IsUpdate
Var Relaunch
Var DeleteData
Var DeleteDataCheckbox

; -------------------------------------------------------------------- pages
!define MUI_WELCOMEPAGE_TITLE "$(WelcomeTitle)"
!define MUI_WELCOMEPAGE_TEXT "$(WelcomeText)"
!insertmacro MUI_PAGE_WELCOME
Page custom OptionsPage OptionsPageLeave
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!define MUI_FINISHPAGE_TITLE "$(FinishTitle)"
!define MUI_FINISHPAGE_TEXT "$(FinishText)"
!define MUI_FINISHPAGE_RUN
!define MUI_FINISHPAGE_RUN_TEXT "$(LaunchNow)"
!define MUI_FINISHPAGE_RUN_FUNCTION LaunchLokum
!define MUI_FINISHPAGE_LINK "$(ProjectLink)"
!define MUI_FINISHPAGE_LINK_LOCATION "${WEBSITE}"
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
UninstPage custom un.DataPage un.DataPageLeave
!insertmacro MUI_UNPAGE_INSTFILES

; ---------------------------------------------------------------- languages
; The first language is the fallback.
!insertmacro MUI_LANGUAGE "English"
!insertmacro MUI_LANGUAGE "Turkish"
!insertmacro MUI_LANGUAGE "German"
!insertmacro MUI_LANGUAGE "French"
!insertmacro MUI_LANGUAGE "Italian"
!insertmacro MUI_LANGUAGE "Spanish"
!insertmacro MUI_LANGUAGE "Swedish"
!insertmacro MUI_LANGUAGE "Korean"
!insertmacro MUI_LANGUAGE "Japanese"
!insertmacro MUI_LANGUAGE "SimpChinese"
!insertmacro MUI_LANGUAGE "TradChinese"
!insertmacro MUI_RESERVEFILE_LANGDLL

!include "${__FILEDIR__}/strings.nsh"

; ---------------------------------------------------------------- helpers

; Sets System.AppUserModel.ID on a shortcut so pinned icons and running
; windows share one taskbar button.  $0 = .lnk path, $1 = AUMID
Function SetShortcutAUMID
  Push $2
  Push $3
  Push $4
  Push $5
  Push $6
  Push $7
  Push $9
  ; CoCreateInstance(CLSID_ShellLink, NULL, CLSCTX_INPROC_SERVER, IID_IShellLinkW)
  System::Call 'ole32::CoCreateInstance(g "{00021401-0000-0000-C000-000000000046}", p 0, i 1, g "{000214F9-0000-0000-C000-000000000046}", *p .r2) i .r9'
  ${If} $9 = 0
    ; IPersistFile
    System::Call '$2->0(g "{0000010b-0000-0000-C000-000000000046}", *p .r3) i .r9'
    ${If} $9 = 0
      ; Load(path, STGM_READWRITE)
      System::Call '$3->5(w r0, i 2) i .r9'
      ${If} $9 = 0
        ; IPropertyStore
        System::Call '$2->0(g "{886D8EEB-8CF2-4446-8D02-CDBA1DBDCF99}", *p .r4) i .r9'
        ${If} $9 = 0
          ; PROPERTYKEY PKEY_AppUserModel_ID = {9F4C2855-9F79-4B39-A8D0-E1D42DE1D5F3}, 5
          System::Call '*(g "{9F4C2855-9F79-4B39-A8D0-E1D42DE1D5F3}", i 5) p .r5'
          ; PROPVARIANT { VT_LPWSTR (31), reserved, pwszVal }
          System::Call '*(&w260 r1) p .r6'
          System::Call '*(&i2 31, &i2 0, &i2 0, &i2 0, p r6, p 0) p .r7'
          System::Call '$4->6(p r5, p r7) i .r9'   ; SetValue
          ${If} $9 = 0
            System::Call '$4->7() i .r9'          ; Commit
          ${EndIf}
          System::Free $7
          System::Free $6
          System::Free $5
          System::Call '$4->2()'
          System::Call '$3->6(p 0, i 1)'          ; Save(NULL, TRUE)
        ${EndIf}
      ${EndIf}
      System::Call '$3->2()'
    ${EndIf}
    System::Call '$2->2()'
  ${EndIf}
  Pop $9
  Pop $7
  Pop $6
  Pop $5
  Pop $4
  Pop $3
  Pop $2
FunctionEnd

; Waits until Lokum is no longer running from $INSTDIR (max ~90 s per try).
; Leaves "1" on the stack when it is safe to continue, "0" otherwise.
Function WaitForLokum
  Push $R0
  Push $R1
  Push $R2
  Push $R3
  StrCpy $R3 "1"
  ${GetParameters} $R0
  ClearErrors
  ${GetOptions} $R0 "/PID=" $R1
  ${IfNot} ${Errors}
  ${AndIf} $R1 != ""
    ; SYNCHRONIZE = 0x00100000
    System::Call 'kernel32::OpenProcess(i 0x00100000, i 0, i $R1) p .R2'
    ${If} $R2 P<> 0
      System::Call 'kernel32::WaitForSingleObject(p $R2, i 60000)'
      System::Call 'kernel32::CloseHandle(p $R2)'
    ${EndIf}
  ${EndIf}
  StrCpy $R1 0
  ${Do}
    ${IfNot} ${FileExists} "$INSTDIR\${APP_EXE}"
      ${Break}
    ${EndIf}
    ; A running executable cannot be opened for writing.
    ClearErrors
    FileOpen $R2 "$INSTDIR\${APP_EXE}" a
    ${IfNot} ${Errors}
      FileClose $R2
      ${Break}
    ${EndIf}
    IntOp $R1 $R1 + 1
    ${If} $R1 > 180
      ${If} ${Silent}
        StrCpy $R3 "0"
        ${Break}
      ${EndIf}
      MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION "$(CloseLokum)" IDRETRY wait_retry
      StrCpy $R3 "0"
      ${Break}
      wait_retry:
      StrCpy $R1 0
    ${EndIf}
    Sleep 500
  ${Loop}
  StrCpy $R0 $R3
  Pop $R3
  Pop $R2
  Pop $R1
  Exch $R0
FunctionEnd

; Removes the files of a previous install, using the manifest written by
; the previous version (never deletes anything it did not install).
Function RemovePreviousFiles
  Push $R0
  Push $R1
  ${If} ${FileExists} "$INSTDIR\lokum-manifest.txt"
    FileOpen $R0 "$INSTDIR\lokum-manifest.txt" r
    ${Do}
      ClearErrors
      FileRead $R0 $R1
      ${If} ${Errors}
        ${Break}
      ${EndIf}
      ${TrimNewLines} $R1 $R1
      ${If} $R1 != ""
      ${AndIf} $R1 != "."
      ${AndIf} $R1 != ".."
        ${If} ${FileExists} "$INSTDIR\$R1\*.*"
          RMDir /r "$INSTDIR\$R1"
        ${Else}
          Delete "$INSTDIR\$R1"
        ${EndIf}
      ${EndIf}
    ${Loop}
    FileClose $R0
    Delete "$INSTDIR\lokum-manifest.txt"
  ${EndIf}
  Pop $R1
  Pop $R0
FunctionEnd

Function LaunchLokum
  Exec '"$INSTDIR\${APP_EXE}"'
FunctionEnd

Function WriteInstallerLocale
  StrCpy $0 "en"
  ${Select} $LANGUAGE
    ${Case} 1055
      StrCpy $0 "tr"
    ${Case} 1031
      StrCpy $0 "de"
    ${Case} 1036
      StrCpy $0 "fr"
    ${Case} 1040
      StrCpy $0 "it"
    ${Case} 1034
      StrCpy $0 "es-ES"
    ${Case} 3082
      StrCpy $0 "es-ES"
    ${Case} 1053
      StrCpy $0 "sv-SE"
    ${Case} 1042
      StrCpy $0 "ko"
    ${Case} 1041
      StrCpy $0 "ja"
    ${Case} 2052
      StrCpy $0 "zh-CN"
    ${Case} 1028
      StrCpy $0 "zh-TW"
  ${EndSelect}
  CreateDirectory "$INSTDIR\distribution"
  FileOpen $1 "$INSTDIR\distribution\lokum-install.json" w
  FileWrite $1 '{"locale": "$0", "installedBy": "installer", "version": "${VERSION}"}'
  FileClose $1
FunctionEnd

; ------------------------------------------------------------------ options

Function OptionsPage
  ${If} $IsUpdate == "1"
    Abort
  ${EndIf}
  !insertmacro MUI_HEADER_TEXT "$(OptionsTitle)" "$(OptionsSubtitle)"
  nsDialogs::Create 1018
  Pop $0
  ${If} $0 == error
    Abort
  ${EndIf}
  ${NSD_CreateLabel} 0 0 100% 24u "$(OptionsIntro)"
  Pop $0
  ${NSD_CreateCheckbox} 0 34u 100% 12u "$(OptDesktop)"
  Pop $DesktopCheckbox
  ${If} $WantDesktop == "1"
    ${NSD_Check} $DesktopCheckbox
  ${EndIf}
  ${NSD_CreateCheckbox} 0 52u 100% 12u "$(OptDefault)"
  Pop $DefaultCheckbox
  ${If} $MakeDefault == "1"
    ${NSD_Check} $DefaultCheckbox
  ${EndIf}
  ${NSD_CreateLabel} 0 80u 100% 36u "$(OptionsNote)"
  Pop $0
  nsDialogs::Show
FunctionEnd

Function OptionsPageLeave
  ${NSD_GetState} $DesktopCheckbox $0
  ${If} $0 == ${BST_CHECKED}
    StrCpy $WantDesktop "1"
  ${Else}
    StrCpy $WantDesktop "0"
  ${EndIf}
  ${NSD_GetState} $DefaultCheckbox $0
  ${If} $0 == ${BST_CHECKED}
    StrCpy $MakeDefault "1"
  ${Else}
    StrCpy $MakeDefault "0"
  ${EndIf}
FunctionEnd

; --------------------------------------------------------------------- init

Function .onInit
  ${IfNot} ${AtLeastWin10}
    MessageBox MB_OK|MB_ICONSTOP "$(NeedsWin10)" /SD IDOK
    Abort
  ${EndIf}
  !if "${ARCH}" == "x64"
    ${IfNot} ${RunningX64}
      MessageBox MB_OK|MB_ICONSTOP "$(Needs64Bit)" /SD IDOK
      Abort
    ${EndIf}
  !endif

  StrCpy $WantDesktop "1"
  StrCpy $MakeDefault "0"
  StrCpy $IsUpdate "0"
  StrCpy $Relaunch "0"
  ${GetParameters} $R0
  ClearErrors
  ${GetOptions} $R0 "/UPDATE" $R1
  ${IfNot} ${Errors}
    StrCpy $IsUpdate "1"
  ${EndIf}
  ClearErrors
  ${GetOptions} $R0 "/RELAUNCH" $R1
  ${IfNot} ${Errors}
    StrCpy $Relaunch "1"
  ${EndIf}
  ClearErrors
  ${GetOptions} $R0 "/DESKTOP=" $R1
  ${IfNot} ${Errors}
    StrCpy $WantDesktop $R1
  ${EndIf}
  ; An existing install counts as an update even when started by hand.
  ReadRegStr $R1 HKCU "${LOKUM_KEY}" "InstallDir"
  ${If} $R1 != ""
  ${AndIf} ${FileExists} "$R1\${APP_EXE}"
    StrCpy $IsUpdate "1"
    ${IfNot} ${FileExists} "$DESKTOP\${APP_NAME}.lnk"
      StrCpy $WantDesktop "0"
    ${EndIf}
  ${EndIf}

  ${IfNot} ${Silent}
    !insertmacro MUI_LANGDLL_DISPLAY
  ${EndIf}
FunctionEnd

; ------------------------------------------------------------------ install

Section "Lokum" SecMain
  SectionIn RO
  SetShellVarContext current
  SetOutPath "$INSTDIR"

  DetailPrint "$(Preparing)"
  Call WaitForLokum
  Pop $0
  ${If} $0 != "1"
    ${If} ${Silent}
      ; The updater will try again on the next quit.
      Quit
    ${EndIf}
    Abort
  ${EndIf}

  Call RemovePreviousFiles

  DetailPrint "$(Copying)"
  File /r "${APP_DIR}/*.*"

  ${If} $IsUpdate != "1"
    Call WriteInstallerLocale
  ${EndIf}

  ; ---- registry: install info
  WriteRegStr HKCU "${LOKUM_KEY}" "InstallDir" "$INSTDIR"
  WriteRegStr HKCU "${LOKUM_KEY}" "Version" "${VERSION}"
  WriteRegStr HKCU "${LOKUM_KEY}" "FirefoxVersion" "${FIREFOX_VERSION}"

  ; ---- taskbar identity (read by Firefox's WinTaskbar)
  WriteRegStr HKCU "Software\Mozilla\Firefox\TaskBarIDs" "$INSTDIR" "${AUMID}"
  WriteRegStr HKCU "Software\Classes\AppUserModelId\${AUMID}" "DisplayName" "${APP_NAME}"
  WriteRegStr HKCU "Software\Classes\AppUserModelId\${AUMID}" "IconUri" "$INSTDIR\browser\VisualElements\VisualElements_70.png"

  ; ---- App Paths ("Run" dialog: lokum)
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\App Paths\${APP_EXE}" "" "$INSTDIR\${APP_EXE}"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\App Paths\${APP_EXE}" "Path" "$INSTDIR"

  ; ---- browser registration (Default Apps)
  !define LOKUM_OPEN_CMD '"$INSTDIR\${APP_EXE}" -osint -url "%1"'
  WriteRegStr HKCU "Software\Classes\LokumHTML" "" "Lokum HTML Document"
  WriteRegStr HKCU "Software\Classes\LokumHTML" "FriendlyTypeName" "Lokum HTML Document"
  WriteRegStr HKCU "Software\Classes\LokumHTML\DefaultIcon" "" "$INSTDIR\lokum-document.ico,0"
  WriteRegStr HKCU "Software\Classes\LokumHTML\shell\open\command" "" '${LOKUM_OPEN_CMD}'
  WriteRegStr HKCU "Software\Classes\LokumHTML\Application" "AppUserModelId" "${AUMID}"
  WriteRegStr HKCU "Software\Classes\LokumHTML\Application" "ApplicationName" "${APP_NAME}"
  WriteRegStr HKCU "Software\Classes\LokumHTML\Application" "ApplicationIcon" "$INSTDIR\${APP_EXE},0"
  WriteRegStr HKCU "Software\Classes\LokumHTML\Application" "ApplicationCompany" "${PUBLISHER}"

  WriteRegStr HKCU "Software\Classes\LokumURL" "" "Lokum URL"
  WriteRegStr HKCU "Software\Classes\LokumURL" "FriendlyTypeName" "Lokum URL"
  WriteRegStr HKCU "Software\Classes\LokumURL" "URL Protocol" ""
  WriteRegDWORD HKCU "Software\Classes\LokumURL" "EditFlags" 0x00000002
  WriteRegStr HKCU "Software\Classes\LokumURL\DefaultIcon" "" "$INSTDIR\${APP_EXE},0"
  WriteRegStr HKCU "Software\Classes\LokumURL\shell\open\command" "" '${LOKUM_OPEN_CMD}'
  WriteRegStr HKCU "Software\Classes\LokumURL\Application" "AppUserModelId" "${AUMID}"
  WriteRegStr HKCU "Software\Classes\LokumURL\Application" "ApplicationName" "${APP_NAME}"
  WriteRegStr HKCU "Software\Classes\LokumURL\Application" "ApplicationIcon" "$INSTDIR\${APP_EXE},0"

  !define LOKUM_SMI "Software\Clients\StartMenuInternet\Lokum"
  WriteRegStr HKCU "${LOKUM_SMI}" "" "${APP_NAME}"
  WriteRegStr HKCU "${LOKUM_SMI}\DefaultIcon" "" "$INSTDIR\${APP_EXE},0"
  WriteRegStr HKCU "${LOKUM_SMI}\shell\open\command" "" '"$INSTDIR\${APP_EXE}"'
  WriteRegStr HKCU "${LOKUM_SMI}\Capabilities" "ApplicationName" "${APP_NAME}"
  WriteRegStr HKCU "${LOKUM_SMI}\Capabilities" "ApplicationIcon" "$INSTDIR\${APP_EXE},0"
  WriteRegStr HKCU "${LOKUM_SMI}\Capabilities" "ApplicationDescription" "$(AppDescription)"
  WriteRegStr HKCU "${LOKUM_SMI}\Capabilities\StartMenu" "StartMenuInternet" "Lokum"
  WriteRegStr HKCU "${LOKUM_SMI}\Capabilities\FileAssociations" ".htm" "LokumHTML"
  WriteRegStr HKCU "${LOKUM_SMI}\Capabilities\FileAssociations" ".html" "LokumHTML"
  WriteRegStr HKCU "${LOKUM_SMI}\Capabilities\FileAssociations" ".shtml" "LokumHTML"
  WriteRegStr HKCU "${LOKUM_SMI}\Capabilities\FileAssociations" ".xht" "LokumHTML"
  WriteRegStr HKCU "${LOKUM_SMI}\Capabilities\FileAssociations" ".xhtml" "LokumHTML"
  WriteRegStr HKCU "${LOKUM_SMI}\Capabilities\FileAssociations" ".svg" "LokumHTML"
  WriteRegStr HKCU "${LOKUM_SMI}\Capabilities\FileAssociations" ".webp" "LokumHTML"
  WriteRegStr HKCU "${LOKUM_SMI}\Capabilities\FileAssociations" ".avif" "LokumHTML"
  WriteRegStr HKCU "${LOKUM_SMI}\Capabilities\FileAssociations" ".pdf" "LokumHTML"
  WriteRegStr HKCU "${LOKUM_SMI}\Capabilities\URLAssociations" "http" "LokumURL"
  WriteRegStr HKCU "${LOKUM_SMI}\Capabilities\URLAssociations" "https" "LokumURL"
  WriteRegStr HKCU "Software\RegisteredApplications" "Lokum" "${LOKUM_SMI}\Capabilities"
  ; "Open with" support
  WriteRegStr HKCU "Software\Classes\.htm\OpenWithProgids" "LokumHTML" ""
  WriteRegStr HKCU "Software\Classes\.html\OpenWithProgids" "LokumHTML" ""
  WriteRegStr HKCU "Software\Classes\.pdf\OpenWithProgids" "LokumHTML" ""
  WriteRegStr HKCU "Software\Classes\.svg\OpenWithProgids" "LokumHTML" ""
  WriteRegStr HKCU "Software\Classes\Applications\${APP_EXE}" "FriendlyAppName" "${APP_NAME}"
  WriteRegStr HKCU "Software\Classes\Applications\${APP_EXE}\shell\open\command" "" '${LOKUM_OPEN_CMD}'

  ; ---- shortcuts
  CreateShortCut "$SMPROGRAMS\${APP_NAME}.lnk" "$INSTDIR\${APP_EXE}" "" "$INSTDIR\${APP_EXE}" 0 SW_SHOWNORMAL "" "$(AppDescription)"
  StrCpy $0 "$SMPROGRAMS\${APP_NAME}.lnk"
  StrCpy $1 "${AUMID}"
  Call SetShortcutAUMID
  ${If} $WantDesktop == "1"
    CreateShortCut "$DESKTOP\${APP_NAME}.lnk" "$INSTDIR\${APP_EXE}" "" "$INSTDIR\${APP_EXE}" 0 SW_SHOWNORMAL "" "$(AppDescription)"
    StrCpy $0 "$DESKTOP\${APP_NAME}.lnk"
    Call SetShortcutAUMID
  ${EndIf}

  ; ---- uninstaller & Apps list
  WriteUninstaller "$INSTDIR\uninstall.exe"
  WriteRegStr HKCU "${UNINST_KEY}" "DisplayName" "${APP_NAME}"
  WriteRegStr HKCU "${UNINST_KEY}" "DisplayVersion" "${VERSION}"
  WriteRegStr HKCU "${UNINST_KEY}" "DisplayIcon" "$INSTDIR\${APP_EXE},0"
  WriteRegStr HKCU "${UNINST_KEY}" "Publisher" "${PUBLISHER}"
  WriteRegStr HKCU "${UNINST_KEY}" "URLInfoAbout" "${WEBSITE}"
  WriteRegStr HKCU "${UNINST_KEY}" "HelpLink" "${WEBSITE}/issues"
  WriteRegStr HKCU "${UNINST_KEY}" "URLUpdateInfo" "${WEBSITE}/releases"
  WriteRegStr HKCU "${UNINST_KEY}" "InstallLocation" "$INSTDIR"
  WriteRegStr HKCU "${UNINST_KEY}" "UninstallString" '"$INSTDIR\uninstall.exe"'
  WriteRegStr HKCU "${UNINST_KEY}" "QuietUninstallString" '"$INSTDIR\uninstall.exe" /S'
  WriteRegStr HKCU "${UNINST_KEY}" "Comments" "Built on Firefox ${FIREFOX_VERSION}"
  WriteRegDWORD HKCU "${UNINST_KEY}" "NoModify" 1
  WriteRegDWORD HKCU "${UNINST_KEY}" "NoRepair" 1
  ${GetSize} "$INSTDIR" "/S=0K" $0 $1 $2
  IntFmt $0 "0x%08X" $0
  WriteRegDWORD HKCU "${UNINST_KEY}" "EstimatedSize" "$0"

  ; Tell Explorer that associations changed (SHCNE_ASSOCCHANGED).
  System::Call 'shell32::SHChangeNotify(i 0x08000000, i 0, p 0, p 0)'

  ${If} $MakeDefault == "1"
    ExecShell "open" "ms-settings:defaultapps?registeredAppUser=Lokum"
  ${EndIf}

  ${If} $Relaunch == "1"
    Exec '"$INSTDIR\${APP_EXE}"'
  ${EndIf}
SectionEnd

; ---------------------------------------------------------------- uninstall

Function un.onInit
  !insertmacro MUI_UNGETLANGUAGE
  StrCpy $DeleteData "0"
FunctionEnd

Function un.DataPage
  !insertmacro MUI_HEADER_TEXT "$(UnDataTitle)" "$(UnDataSubtitle)"
  nsDialogs::Create 1018
  Pop $0
  ${NSD_CreateLabel} 0 0 100% 36u "$(UnDataText)"
  Pop $0
  ${NSD_CreateCheckbox} 0 44u 100% 12u "$(UnDataCheckbox)"
  Pop $DeleteDataCheckbox
  nsDialogs::Show
FunctionEnd

Function un.DataPageLeave
  ${NSD_GetState} $DeleteDataCheckbox $0
  ${If} $0 == ${BST_CHECKED}
    StrCpy $DeleteData "1"
  ${EndIf}
FunctionEnd

Function un.RemoveProfileDir
  ; $0 = registry value name; deletes the folder only if it looks like a
  ; Firefox/Lokum profile.
  ReadRegStr $1 HKCU "${LOKUM_KEY}" $0
  ${If} $1 != ""
  ${AndIf} ${FileExists} "$1\*.*"
    ${If} ${FileExists} "$1\prefs.js"
    ${OrIf} ${FileExists} "$1\cache2\*.*"
    ${OrIf} ${FileExists} "$1\startupCache\*.*"
      RMDir /r "$1"
    ${EndIf}
  ${EndIf}
FunctionEnd

Section "Uninstall"
  SetShellVarContext current

  ; Is Lokum running?
  ${Do}
    ClearErrors
    ${IfNot} ${FileExists} "$INSTDIR\${APP_EXE}"
      ${Break}
    ${EndIf}
    FileOpen $0 "$INSTDIR\${APP_EXE}" a
    ${IfNot} ${Errors}
      FileClose $0
      ${Break}
    ${EndIf}
    MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION "$(CloseLokum)" /SD IDCANCEL IDRETRY +2
    Abort
  ${Loop}

  ${If} $DeleteData == "1"
    StrCpy $0 "ProfilePath"
    Call un.RemoveProfileDir
    StrCpy $0 "LocalProfilePath"
    Call un.RemoveProfileDir
  ${EndIf}

  ; Files (listed in the manifest written at build time)
  ${If} ${FileExists} "$INSTDIR\lokum-manifest.txt"
    FileOpen $0 "$INSTDIR\lokum-manifest.txt" r
    ${Do}
      ClearErrors
      FileRead $0 $1
      ${If} ${Errors}
        ${Break}
      ${EndIf}
      ${un.TrimNewLines} $1 $1
      ${If} $1 != ""
      ${AndIf} $1 != "."
      ${AndIf} $1 != ".."
        ${If} ${FileExists} "$INSTDIR\$1\*.*"
          RMDir /r "$INSTDIR\$1"
        ${Else}
          Delete "$INSTDIR\$1"
        ${EndIf}
      ${EndIf}
    ${Loop}
    FileClose $0
    Delete "$INSTDIR\lokum-manifest.txt"
  ${EndIf}
  RMDir /r "$INSTDIR\distribution"
  Delete "$INSTDIR\uninstall.exe"
  RMDir "$INSTDIR\browser"
  RMDir "$INSTDIR"

  Delete "$SMPROGRAMS\${APP_NAME}.lnk"
  Delete "$DESKTOP\${APP_NAME}.lnk"

  DeleteRegKey HKCU "${UNINST_KEY}"
  DeleteRegKey HKCU "Software\Classes\LokumHTML"
  DeleteRegKey HKCU "Software\Classes\LokumURL"
  DeleteRegKey HKCU "Software\Clients\StartMenuInternet\Lokum"
  DeleteRegValue HKCU "Software\RegisteredApplications" "Lokum"
  DeleteRegValue HKCU "Software\Classes\.htm\OpenWithProgids" "LokumHTML"
  DeleteRegValue HKCU "Software\Classes\.html\OpenWithProgids" "LokumHTML"
  DeleteRegValue HKCU "Software\Classes\.pdf\OpenWithProgids" "LokumHTML"
  DeleteRegValue HKCU "Software\Classes\.svg\OpenWithProgids" "LokumHTML"
  DeleteRegKey HKCU "Software\Classes\Applications\${APP_EXE}"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\App Paths\${APP_EXE}"
  DeleteRegValue HKCU "Software\Mozilla\Firefox\TaskBarIDs" "$INSTDIR"
  DeleteRegKey HKCU "Software\Classes\AppUserModelId\${AUMID}"
  DeleteRegKey HKCU "${LOKUM_KEY}"

  System::Call 'shell32::SHChangeNotify(i 0x08000000, i 0, p 0, p 0)'
SectionEnd
