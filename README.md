# VSCode Game Sound

[English](#english) | [日本語](#japanese)

<a id="english"></a>
## English

Add exciting game-like action sounds to your coding experience in Visual Studio Code!

### Features

- Game-inspired sound effects for every key press
- Special sound effects for different keys (Enter, Tab, Space, Backspace, etc.)
- Combo system that recognizes rapid typing and plays special sounds
- Customizable volume and settings
- Anti-key-repeat protection (prevents sound flooding when holding down keys)

### Settings

This extension supports the following settings:

* `gameSound.enabled`: Enable or disable game sounds
* `gameSound.volume`: Sound volume (0-100)
* `gameSound.keyCooldown`: Minimum interval between sounds for the same key (milliseconds)
* `gameSound.comboEnabled`: Enable combo sounds and notifications when typing quickly
* `gameSound.specialKeys`: Enable/disable specific special key sounds

### Commands

* `gameSound.toggle`: Toggle game sounds on/off

### Supported Platforms

- Windows
- macOS
- Linux (requires a Sound Player installation)

### Installation

You can install this extension from the VSCode Extension Marketplace by searching for "VSCode Game Sound".

---

<a id="japanese"></a>
## 日本語

Visual Studio Codeでのコーディングにゲームのようなアクション効果音を追加します！

### 機能

- ゲームにインスパイアされたキー入力音
- 特殊キー（Enter、Tab、Space、Backspaceなど）に独自の効果音
- 連続タイピングを認識し特殊なコンボ効果音を再生
- カスタマイズ可能な音量と設定
- 長押し対策（キーリピート検出）

### 設定オプション

この拡張機能は以下の設定をサポートしています：

* `gameSound.enabled`: 効果音を有効/無効にする
* `gameSound.volume`: 音量（0-100）
* `gameSound.keyCooldown`: 同一キーの再生間隔（ミリ秒）
* `gameSound.comboEnabled`: 連続タイピング時のコンボサウンドと通知の有効/無効
* `gameSound.specialKeys`: 特殊キーの有効/無効設定

### コマンド

* `gameSound.toggle`: ゲーム効果音のオン/オフを切り替え

### 対応プラットフォーム

- Windows
- macOS
- Linux (要Sound Playerのインストール)

### インストール

VSCodeの拡張機能マーケットプレイスから「VSCode Game Sound」を検索してインストールできます。

## Required Sound Files / 必要な音源ファイル

Place the following MP3 files in the `media/sounds/` folder:  
以下のMP3ファイルを `media/sounds/` フォルダに配置してください：

### Basic Key Sounds / 基本キーサウンド
- `key-press.mp3` - Normal key typing sound / 通常のキー入力音
- `enter.mp3` - Enter key sound effect / Enterキー用効果音
- `tab.mp3` - Tab key sound effect / Tabキー用効果音
- `space.mp3` - Space key sound effect / スペースキー用効果音
- `backspace.mp3` - Backspace key sound effect / Backspaceキー用効果音

### Special Key Sounds / 特殊キーサウンド
- `delete.mp3` - Delete key or large text deletion / Deleteキーまたは大量テキスト削除音
- `arrowup.mp3` - Up arrow key / 上矢印キー
- `arrowdown.mp3` - Down arrow key / 下矢印キー
- `arrowleft.mp3` - Left arrow key / 左矢印キー
- `arrowright.mp3` - Right arrow key / 右矢印キー
- `ctrl.mp3` - Ctrl key / Ctrlキー
- `shift.mp3` - Shift key / Shiftキー
- `alt.mp3` - Alt key / Altキー
- `escape.mp3` - Escape key / Escapeキー

### Combo Sounds / コンボサウンド
- `combo-10.mp3` - Sound for 10-hit combo / 10ヒットコンボ音
- `combo-20.mp3` - Sound for 20-hit combo / 20ヒットコンボ音
- `combo-30.mp3` - Sound for 30-hit combo / 30ヒットコンボ音
- `combo-50.mp3` - Sound for 50-hit combo / 50ヒットコンボ音
- `combo-100.mp3` - Sound for 100-hit combo / 100ヒットコンボ音

## License / ライセンス

MIT

## Author / 作者

kpab