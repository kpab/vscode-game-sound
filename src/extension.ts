import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// プレイヤーのセットアップ
// OSごとに適切なプレイヤーを使用
let playerOptions: any = {};
if (process.platform === 'darwin') {
    // Macの場合はafplayを使用
    playerOptions.player = 'afplay';
} else if (process.platform === 'win32') {
    // Windowsの場合はpowershellを使用
    playerOptions.player = 'powershell';
    playerOptions.cmd = ['New-Object System.Media.SoundPlayer \"$FILE\"; $player.PlaySync();'];
} else {
    // Linuxなどその他の場合
    playerOptions.player = 'play';
}

const player = require('play-sound')(playerOptions);

// 最後のキー押下時間を追跡
const lastKeyPressTime: Record<string, number> = {};

// コンボカウンターを追跡
let comboCount: number = 0;
let lastKeyPressGlobalTime: number = 0;
const COMBO_RESET_TIME = 1500; // 1.5秒間キー入力がないとコンボリセット

// サウンドパスの設定
let soundsPath: string;
// 設定項目
let enabled: boolean = true; // デフォルトで有効
let volume: number = 50; // デフォルト音量
let keyCooldown: number = 50; // デフォルトクールダウン時間
let comboEnabled: boolean = true; // デフォルトでコンボ有効
let specialKeys: Record<string, boolean> = {
    'Enter': true,
    'Tab': true,
    'Space': true,
    'Backspace': true,
    'Delete': true,
    'ArrowUp': true,
    'ArrowDown': true,
    'ArrowLeft': true,
    'ArrowRight': true,
    'Ctrl': true,
    'Shift': true,
    'Alt': true,
    'Escape': true
};

export function activate(context: vscode.ExtensionContext) {
    console.log('VSCode Game Sound extension is now active!');

    // 初期サウンドパスの設定
    soundsPath = path.join(context.extensionPath, 'media', 'sounds');
    
    // 設定の読み込み
    loadConfiguration();

    // 設定変更時のイベントハンドラー
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('gameSound')) {
                loadConfiguration();
            }
        })
    );

    // キーボードイベントのリスナーを登録
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(handleTextDocumentChange)
    );

    // コマンド登録
    context.subscriptions.push(
        vscode.commands.registerCommand('gameSound.toggle', () => {
            enabled = !enabled;
            vscode.window.showInformationMessage(`VSCode Game Sound: ${enabled ? 'Enabled' : 'Disabled'}`);
            
            // 設定を永続化
            const config = vscode.workspace.getConfiguration('gameSound');
            config.update('enabled', enabled, true).then(() => {
                // 更新完了
            });
        })
    );
    
    // デバッグ用: 起動時にコンソールに音声ファイルパスを表示
    console.log('Sound files path:', soundsPath);
    try {
        fs.readdirSync(soundsPath).forEach(file => {
            console.log('Found sound file:', file);
        });
    } catch (err) {
        console.error('Error reading sound files directory:', err);
    }
}

function loadConfiguration() {
    const config = vscode.workspace.getConfiguration('gameSound');
    enabled = config.get('enabled', true);
    volume = config.get('volume', 50);
    keyCooldown = config.get('keyCooldown', 50);
    comboEnabled = config.get('comboEnabled', true);
    
    // 拡張された特殊キー設定
    specialKeys = config.get('specialKeys', {
        'Enter': true,
        'Tab': true,
        'Space': true,
        'Backspace': true,
        'Delete': true,
        'ArrowUp': true,
        'ArrowDown': true,
        'ArrowLeft': true,
        'ArrowRight': true,
        'Ctrl': true,
        'Shift': true,
        'Alt': true,
        'Escape': true
    });
    
    console.log('Configuration loaded:', { enabled, volume, keyCooldown, comboEnabled });
}

function handleTextDocumentChange(event: vscode.TextDocumentChangeEvent) {
    if (!enabled) return;

    const now = Date.now();
    const changes = event.contentChanges;
    
    // Debug log
    console.log(`Text changed, ${changes.length} changes detected`);

    // コンボリセットチェック
    if (comboEnabled && now - lastKeyPressGlobalTime > COMBO_RESET_TIME) {
        comboCount = 0;
    }
    
    lastKeyPressGlobalTime = now;

    for (const change of changes) {
        const text = change.text;
        console.log('Change detected:', { text, rangeLength: change.rangeLength });

        // コンボカウント増加
        if (comboEnabled && (text || change.rangeLength > 0)) {
            comboCount++;
            console.log('Combo count:', comboCount);
            checkAndPlayComboSound(now);
        }

        // 入力されたテキストに基づいてサウンドを再生
        if (text) {
            if (text === '\n' || text === '\r\n') {
                console.log('Playing Enter sound');
                playKeySound('Enter', now);
            } else if (text === '\t') {
                console.log('Playing Tab sound');
                playKeySound('Tab', now);
            } else if (text === ' ') {
                console.log('Playing Space sound');
                playKeySound('Space', now);
            } else if (text.length === 1) {
                // 通常のキー入力
                console.log('Playing default key sound');
                playKeySound('default', now);
            }
        } else if (change.rangeLength > 0) {
            if (change.rangeLength <= 2) {
                // 削除操作（Backspaceなど）
                console.log('Playing Backspace sound');
                playKeySound('Backspace', now);
            } else {
                // 大量削除（Deleteキーや選択削除など）
                console.log('Playing Delete sound');
                playKeySound('Delete', now);
            }
        }
    }
}

function checkAndPlayComboSound(timestamp: number) {
    // コンボ数に応じて特別な効果音を再生
    if (!comboEnabled) return;
    
    // 連続コンボヒット音を鳴らす閾値
    const comboThresholds = [10, 20, 30, 50, 100];
    
    for (const threshold of comboThresholds) {
        if (comboCount === threshold) {
            const comboFile = `combo-${threshold}.mp3`;
            const comboPath = path.join(soundsPath, comboFile);
            
            console.log(`Trying to play combo sound: ${comboPath}`);
            
            if (fs.existsSync(comboPath)) {
                playSound(comboPath, timestamp, 'combo');
                
                // コンボ達成メッセージを表示
                vscode.window.setStatusBarMessage(`🔥 Combo x${comboCount}!`, 2000);
                break;
            } else {
                console.log(`Combo sound file not found: ${comboPath}`);
            }
        }
    }
}

function playKeySound(keyType: string, timestamp: number) {
    // クールダウンチェック
    if (keyCooldown > 0) {
        const lastTime = lastKeyPressTime[keyType] || 0;
        if (timestamp - lastTime < keyCooldown) {
            console.log(`Skipping sound for ${keyType} (cooldown)`);
            return; // クールダウン中なのでスキップ
        }
    }

    // 最終押下時間を更新
    lastKeyPressTime[keyType] = timestamp;

    // キータイプに応じたサウンドファイルを選択
    let soundFile = 'key-press.mp3'; // デフォルト
    
    if (specialKeys[keyType] && keyType !== 'default') {
        const specificFile = `${keyType.toLowerCase()}.mp3`;
        const specificPath = path.join(soundsPath, specificFile);
        
        // 特定キー用のサウンドファイルが存在するか確認
        if (fs.existsSync(specificPath)) {
            soundFile = specificFile;
            console.log(`Using specific sound file: ${specificFile}`);
        } else {
            console.log(`Specific sound file not found: ${specificPath}, using default`);
        }
    }

    const soundPath = path.join(soundsPath, soundFile);
    console.log(`Attempting to play sound: ${soundPath}`);
    playSound(soundPath, timestamp, keyType);
}

function playSound(soundPath: string, timestamp: number, soundType: string) {
    // ファイルの存在確認
    if (!fs.existsSync(soundPath)) {
        console.error(`Sound file not found: ${soundPath}`);
        return;
    }

    // 音量調整（0-100の範囲）
    let playerArgs: string[] = [];
    
    if (process.platform === 'darwin') {
        // Macの場合はafplayの-vオプションで音量指定（0.0～1.0）
        const volumeLevel = volume / 100;
        playerArgs = ['-v', volumeLevel.toString()];
    } else if (process.platform === 'win32') {
        // Windowsの場合は音量調整が必要ならばここに実装
    }

    console.log(`Playing sound: ${soundPath} with args:`, playerArgs);

    try {
        player.play(soundPath, { [process.platform === 'darwin' ? 'afplay' : process.platform === 'win32' ? 'powershell' : 'play']: playerArgs }, (err: any) => {
            if (err) {
                console.error('Error playing sound:', err);
            } else {
                console.log(`Successfully played sound: ${soundPath}`);
            }
        });
    } catch (err) {
        console.error('Exception while playing sound:', err);
    }
}

export function deactivate() {
    // 拡張機能の終了時に必要な処理があればここに
    console.log('VSCode Game Sound extension is now deactivated.');
}